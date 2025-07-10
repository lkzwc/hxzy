
"use client";

import { useState, useEffect, useRef } from "react";
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
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import {
  Button,
  message,
  Result,
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
  const loadingRef = useRef<HTMLDivElement>(null);
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

  // 监nfromlayout.tsx发出的分类变更事件
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

  // 监听滚动加载
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isLoadingMore) {
          setSize((size) => size + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore]);




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
              <button
                onClick={() => {
                  if (!session) {
                    router.push("/api/auth/signin");
                  }
                  // 如果已登录，滚动到发帖组件
                  const composer = document.querySelector('[data-composer]');
                  if (composer) {
                    composer.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm hover:shadow"
              >
                <PlusOutlined className="w-4 h-4" />
                <span>发帖</span>
              </button>
            </div>
          </div>
        </div>

        {/* 发帖组件区域 */}
        {session && (
          <div className="border-b border-gray-100">
            <TwitterStylePostComposer
              placeholder="说说您的新鲜事..."
              onSuccess={() => {
                // 刷新数据
                mutate();
              }}
            />
          </div>
        )}

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
          ) : (
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
                          <img
                            src={post.author.image}
                            alt={post.author.name || "用户头像"}
                            className="w-10 h-10 rounded-full object-cover shadow-lg outline outline-3 outline-primary-600"
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
                        <div className="flex items-center gap-1 ">
                          <EyeOutlined className="w-4 h-4 " />
                          <span className="text-xs font-medium ">{post.views}</span>
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
                          className="block flex-shrink-0 w-16 h-16"
                        >
                          <div className="relative overflow-hidden rounded-lg bg-gray-100 w-full h-full shadow-sm ring-1 ring-gray-200/50">
                            <img
                              src={post.images[0]}
                              alt="帖子图片"
                              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
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
                  ref={loadingRef}
                  className="flex justify-center items-center py-4"
                >
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
