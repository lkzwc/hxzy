
"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  EyeOutlined,
  MessageOutlined,
  PlusOutlined,
  SendOutlined,
} from "@ant-design/icons";
import TwitterStylePostComposer from "@/components/TwitterStylePostComposer";
import LikeButton from "@/components/LikeButton";
import OptimizedImage from "@/components/OptimizedImage";
import { useInfiniteScroll, useVirtualScroll } from "@/hooks/useInfiniteScroll";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import {
  Button,
  message,
  Result,
  Tag,
} from "antd";

// 配置 dayjs
dayjs.locale("zh-cn");
dayjs.extend(relativeTime);

interface Author {
  id: number;
  name: string | null;
  image: string | null;
}

interface Post {
  id: number;
  content: string;
  createdAt: string;
  views: number;
  tags: string[];
  author: Author;
  _count: {
    comments: number;
    postLikes: number;
  };
}

interface PostsResponse {
  posts: Array<{
    id: string;
    content: string;
    createdAt: string;
    views: number;
    tags: string[];
    author: {
      name: string | null;
      image: string | null;
    };
    _count: {
      likes: number;
      comments: number;
    };
  }>;
  hasMore: boolean;
}

// 定义获取帖子的fetcher函数
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("获取帖子列表失败");
  }
  return res.json();
};

export default function Community() {
  const [searchInput, setSearchInput] = useState(""); // 用于输入框的值
  const [searchQuery, setSearchQuery] = useState(""); // 用于实际搜索的值
  const [activeCategory, setActiveCategory] = useState<any>(undefined);
  const [messageApi, contextHolder] = message.useMessage();
  const [useVirtualScrolling, setUseVirtualScrolling] = useState(false); // 是否启用虚拟滚动
  const [containerHeight, setContainerHeight] = useState(800); // 容器高度
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  // 构建查询参数
  const getQueryParams = (pageNum: number) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (activeCategory) params.set("tag", activeCategory);
    params.set("page", pageNum.toString());
    params.set("limit", "10");
    return params.toString();
  };

  // 使用SWR获取帖子数据 - 优化配置
  const {
    data,
    error,
    isLoading: postsLoading,
    size,
    setSize,
    mutate,
  } = useSWRInfinite<PostsResponse>(
    (index) => `/api/posts?${getQueryParams(index + 1)}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateFirstPage: false,
      dedupingInterval: 60000, // 1分钟内不重复请求
      focusThrottleInterval: 5000, // 5秒内不重复聚焦请求
      errorRetryInterval: 5000, // 错误重试间隔
      errorRetryCount: 3, // 最多重试3次
    }
  );

  // 合并所有页面的数据
  const posts = data ? data.flatMap((page) => page.posts) : [];
  const hasMore = data ? data[data.length - 1]?.hasMore : true;
  const isLoadingMore =
    postsLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  // 处理搜索和分类筛选
  const handleSearch = () => {
    const trimmedInput = searchInput.trim();
    setSearchQuery(trimmedInput);
    setActiveCategory(undefined); // 重置分类为全部

    // 更新 URL 参数，使用 Next.js 的路由 API 而不是直接操作 window
    const params = new URLSearchParams();
    if (trimmedInput) {
      params.set("search", trimmedInput);
    }
    // 移除tag参数，因为已重置为全部
    const newUrl = `${pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    router.push(newUrl, { scroll: false });

    // 重置页码并重新获取数据
    setSize(1);
  };

  // 处理回车搜索
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // 初始化搜索和分类参数
  useEffect(() => {
    const tag = searchParams?.get("tag");
    const search = searchParams?.get("search");
    if (tag) {
      setSearchInput("");
      setActiveCategory(tag);
    } else if (!tag && pathname === "/community") {
      // 如果URL中没有tag参数，重置为"全部"
      setActiveCategory(undefined);
    }
    if (search) {
      setSearchInput(search);
      setSearchQuery(search);
    }
  }, [searchParams]);

  // 监听来自layout.tsx发出的分类变更事件
  useEffect(() => {
    const handleCategoryEvent = (event: CustomEvent) => {
      const categoryName = event.detail;
      setActiveCategory(categoryName);
      setSearchInput(""); // 清空搜索框
      setSearchQuery(""); // 清空搜索查询
      // 重置页码并重新获取数据
      setSize(1);
    };

    document.addEventListener(
      "categoryChanged",
      handleCategoryEvent as EventListener
    );

    return () => {
      document.removeEventListener(
        "categoryChanged",
        handleCategoryEvent as EventListener
      );
    };
  }, [setSize]);

  // 监听来自layout.tsx发出的清空搜索事件
  useEffect(() => {
    const handleClearSearchEvent = () => {
      setSearchInput(""); // 清空搜索框
      setSearchQuery(""); // 清空搜索查询
      setActiveCategory(undefined); // 重置分类为全部
      // 重置页码并重新获取数据
      setSize(1);
    };

    document.addEventListener("clearSearch", handleClearSearchEvent);

    return () => {
      document.removeEventListener("clearSearch", handleClearSearchEvent);
    };
  }, [setSize]);

  // 使用优化的无限滚动 Hook
  const {
    isFetching: isInfiniteScrollFetching,
    lastElementRef,
    setHasMore,
  } = useInfiniteScroll(
    async () => {
      if (!hasMore || isLoadingMore) return;
      setSize((size) => size + 1);
    },
    {
      threshold: 100,
      enabled: hasMore && !isLoadingMore,
      delay: 300,
    }
  );

  // 同步 hasMore 状态
  useEffect(() => {
    setHasMore(hasMore);
  }, [hasMore, setHasMore]);

  // 获取所有帖子数据用于虚拟滚动
  const allPosts = useMemo(() => {
    if (!data) return [];
    return data.flatMap((page) => page.posts);
  }, [data]);

  // 虚拟滚动配置
  const ITEM_HEIGHT = 120; // 每个帖子项的高度（像素）
  const virtualScroll = useVirtualScroll(allPosts, {
    itemHeight: ITEM_HEIGHT,
    containerHeight,
    overscan: 5,
  });

  // 检测是否应该启用虚拟滚动（当帖子数量超过50时）
  useEffect(() => {
    setUseVirtualScrolling(allPosts.length > 50);
  }, [allPosts.length]);

  // 动态设置容器高度
  useEffect(() => {
    const updateContainerHeight = () => {
      const windowHeight = window.innerHeight;
      const headerHeight = 200; // 估算的头部高度
      setContainerHeight(windowHeight - headerHeight);
    };

    updateContainerHeight();
    window.addEventListener('resize', updateContainerHeight);
    return () => window.removeEventListener('resize', updateContainerHeight);
  }, []);




  if (error) {
    return (
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={
          <Button type="primary" onClick={() => router.refresh()}>
            刷新
          </Button>
        }
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      {contextHolder}

      {/* 主容器 - 最大宽度1100px */}
      <div className="mx-auto bg-white min-h-screen shadow-sm">
        {/* 固定的顶部搜索栏 */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-gray-100">
          <div className="px-4 py-3">
            {/* 搜索栏 */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-primary/20 hover:bg-gray-100 transition-all border border-gray-200/50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="搜索感兴趣的内容..."
                    className="flex-1 text-sm bg-transparent focus:outline-none min-w-0"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>
              <button
                onClick={handleSearch}
                className="flex-shrink-0 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm hover:shadow"
              >
                搜索
              </button>

              {/* 虚拟滚动切换按钮 */}
              {allPosts.length > 20 && (
                <button
                  onClick={() => setUseVirtualScrolling(!useVirtualScrolling)}
                  className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                    useVirtualScrolling
                      ? 'text-primary-600 bg-primary-50 border border-primary-200'
                      : 'text-gray-500 hover:text-primary-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                  title={useVirtualScrolling ? '切换到普通滚动模式' : '切换到虚拟滚动模式（适合大量数据）'}
                >
                  {useVirtualScrolling ? '虚拟滚动' : '普通模式'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="border-b border-gray-100">
            <TwitterStylePostComposer
              placeholder="说说您的新鲜事..."
              onSuccess={() => {
                // 刷新数据
                mutate();
              }}
            />
          </div>

        {/* 主要内容区域 */}
        <div className="flex-1">
          {data?.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-sm">暂无帖子，来发布第一篇吧</div>
            </div>
          )}

          {/* 帖子列表 */}
          {postsLoading && posts.length === 0 ? (
            // 优化的骨架屏 - 模拟真实帖子布局
            <div className="space-y-0">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="px-4 py-3 border-b border-gray-100">
                  {/* 顶部作者信息骨架 */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-12"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-8"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-8"></div>
                    </div>
                  </div>

                  {/* 内容区域骨架 */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      </div>
                      {/* 标签骨架 */}
                      <div className="flex gap-1 mt-2">
                        <div className="h-5 bg-gray-200 rounded-full animate-pulse w-12"></div>
                        <div className="h-5 bg-gray-200 rounded-full animate-pulse w-16"></div>
                      </div>
                    </div>
                    {i % 2 === 0 && (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : useVirtualScrolling ? (
            // 虚拟滚动渲染
            <div
              className="virtual-scroll-container overflow-auto"
              style={{ height: containerHeight }}
              onScroll={virtualScroll.handleScroll}
            >
              {/* 总高度占位符 */}
              <div style={{ height: virtualScroll.totalHeight, position: 'relative' }}>
                {/* 可见项目容器 */}
                <div
                  style={{
                    transform: `translateY(${virtualScroll.offsetY}px)`,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                  }}
                >
                  {virtualScroll.visibleItems.map((post: any) => (
                    <div
                      key={post.id}
                      style={{ height: ITEM_HEIGHT }}
                      className="virtual-post-item"
                    >
                      <article className="relative bg-white hover:bg-gray-50/30 transition-all duration-200 group border-b border-gray-100 last:border-b-0">
                        <div className="px-4 py-3">
                          <div className="flex gap-4">
                            {/* 左侧内容 */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-3 mb-3">
                                {/* 用户头像 */}
                                <div className="relative">
                                  {post.author.image ? (
                                    <OptimizedImage
                                      src={post.author.image}
                                      alt={post.author.name || "用户头像"}
                                      width={40}
                                      height={40}
                                      className="w-10 h-10 rounded-full object-cover shadow-lg outline outline-3 outline-primary-600"
                                      priority={false}
                                      quality={80}
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full flex outline outline-3 outline-primary-600 items-center justify-center shadow-lg">
                                      <span className="text-sm font-medium text-primary-600">
                                        {post.author.name?.charAt(0) || "U"}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* 用户信息和时间 */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-gray-900 truncate">
                                      {post.author.name}
                                    </span>
                                    <span className="text-gray-400 text-sm">·</span>
                                    <span className="text-gray-500 text-sm whitespace-nowrap">
                                      {dayjs(post.createdAt).fromNow()}
                                    </span>
                                    {/* 位置信息 */}
                                    {post.province && (
                                      <>
                                        <span className="text-gray-400 text-sm">·</span>
                                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                          </svg>
                                          <span className="truncate max-w-20">
                                            {post.province}
                                          </span>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* 帖子内容 */}
                              <Link href={`/community/${post.id}`} className="block group/content">
                                <p className="text-gray-900 text-sm line-clamp-3 mb-3 leading-relaxed group-hover/content:text-primary-600 transition-colors">
                                  {post.content}
                                </p>
                              </Link>

                              {/* 标签 */}
                              {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {post.tags.slice(0, 3).map((tag: string) => (
                                    <Tag
                                      key={tag}
                                      className="text-xs px-2 py-1 bg-primary-50 text-primary-700 border-primary-200 rounded-full"
                                    >
                                      {tag}
                                    </Tag>
                                  ))}
                                  {post.tags.length > 3 && (
                                    <span className="text-xs text-gray-400">+{post.tags.length - 3}</span>
                                  )}
                                </div>
                              )}

                              {/* 互动数据 */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <div className="flex items-center gap-1 text-primary-600 hover:text-primary-700 transition-colors group/view">
                                    <EyeOutlined className="w-4 h-4 group-hover/view:scale-110 transition-transform" />
                                    <span className="text-xs font-medium">{post.views}</span>
                                  </div>

                                  <div className="flex items-center gap-1 text-primary-600 hover:text-primary-700 transition-colors">
                                    <MessageOutlined className="w-4 h-4" />
                                    <span className="text-xs font-medium">{post._count.comments}</span>
                                  </div>
                                </div>

                                <LikeButton
                                  postId={post.id}
                                  initialLikes={post._count.likes}
                                />
                              </div>
                            </div>

                            {/* 右侧图片区域 */}
                            {post.images && post.images.length > 0 && (
                              <Link
                                href={`/community/${post.id}`}
                                className="block flex-shrink-0 w-20 h-16"
                              >
                                <div className="relative overflow-hidden rounded-lg bg-gray-100 w-full h-full shadow-sm ring-1 ring-gray-200/50">
                                  <OptimizedImage
                                    src={post.images[0]}
                                    alt="帖子图片"
                                    width={80}
                                    height={64}
                                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                    priority={false}
                                    quality={75}
                                    sizes="80px"
                                  />
                                  {post.images.length > 1 && (
                                    <div className="absolute top-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded-md font-medium">
                                      +{post.images.length - 1}
                                    </div>
                                  )}
                                </div>
                              </Link>
                            )}
                          </div>
                        </div>
                      </article>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // 普通滚动渲染
            <div>
              {posts.map((post: any) => (
                <article
                  key={post.id}
                  className="relative bg-white hover:bg-gray-50/30 transition-all duration-200 group border-b border-gray-100 last:border-b-0"
                >
                  <div className="px-4 py-3">
                    {/* 顶部作者信息 - 重新设计 */}
                    <div className="flex items-center gap-3 mb-3">
                      {/* 用户头像 */}
                      <div className="relative">
                        {post.author.image ? (
                          <OptimizedImage
                            src={post.author.image}
                            alt={post.author.name || "用户头像"}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover shadow-lg outline outline-3 outline-primary-600"
                            priority={false}
                            quality={80}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full flex outline outline-3 outline-primary-600  items-center justify-center shadow-lg">
                            <span className="text-primary text-sm  font-bold">
                              {(post.author.name || "匿名")[0]}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* 用户信息 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {post.author.name || "匿名用户"}
                          </span>
                          <span className="text-xs text-gray-400 flex-shrink-0">
                            {dayjs(post.createdAt).fromNow()}
                          </span>
                          {/* 位置信息 */}
                          {post.province && (
                            <>
                              <span className="text-gray-400 text-xs">·</span>
                              <div className="flex items-center gap-1 text-gray-400 text-xs">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <span className="truncate max-w-16">
                                  {post.province}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* 右侧互动数据 */}
                      <div className="flex items-center gap-3 text-gray-400">
                        <Link
                          href={`/community/${post.id}`}
                          className="flex items-center gap-1 text-primary-500  hover:text-primary transition-colors group/comment"
                        >
                          <MessageOutlined className="w-4 h-4 group-hover/comment:scale-110 transition-transform" />
                          <span className="text-xs font-medium">{post._count.comments}</span>
                        </Link>
                        <div className="flex items-center gap-1 text-primary-600 hover:text-primary-700 transition-colors group/view">
                          <EyeOutlined className="w-4 h-4 group-hover/view:scale-110 transition-transform" />
                          <span className="text-xs font-medium">{post.views}</span>
                        </div>
                      </div>
                    </div>

                    {/* 内容区域和图片区域的弹性布局 */}
                    <div className="flex gap-3">
                      {/* 左侧内容区域 */}
                      <div className="flex-1 min-w-0">
                        {/* 内容预览 - 作为主要显示内容 */}
                        <Link href={`/community/${post.id}`} className="block group-hover:no-underline">
                          <p className="text-sm text-gray-800 group-hover:text-gray-900 transition-colors line-clamp-2 leading-relaxed mb-2">
                            {post.content}
                          </p>
                        </Link>

                        {/* 标签显示 */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {post.tags.slice(0, 3).map((tag: string, index: number) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary/80 hover:bg-primary/15 transition-colors"
                              >
                                #{tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="text-xs text-gray-400">
                                +{post.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* 右侧图片区域 */}
                      {post.images && post.images.length > 0 && (
                        <Link
                          href={`/community/${post.id}`}
                          className="block flex-shrink-0 w-20 h-16"
                        >
                          <div className="relative overflow-hidden rounded-lg bg-gray-100 w-full h-full shadow-sm ring-1 ring-gray-200/50">
                            <OptimizedImage
                              src={post.images[0]}
                              alt="帖子图片"
                              width={80}
                              height={64}
                              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                              priority={false}
                              quality={75}
                              sizes="80px"
                            />
                            {post.images.length > 1 && (
                              <div className="absolute top-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded-md font-medium">
                                +{post.images.length - 1}
                              </div>
                            )}
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              ))}

              {/* 加载更多指示器 */}
              {hasMore && (
                <div
                  ref={lastElementRef}
                  className="flex justify-center items-center py-8"
                >
                  {(isLoadingMore || isInfiniteScrollFetching) ? (
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                      <span className="text-sm">加载中...</span>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">滚动加载更多</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
