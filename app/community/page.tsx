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
  HeartOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import CreatePostModal from "@/components/CreatePostModal";
import LikeButton from "@/components/LikeButton";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { Button, Empty, Result, Tag } from "antd";

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
  title: string;
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
    title: string;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(""); // 用于输入框的值
  const [searchQuery, setSearchQuery] = useState(""); // 用于实际搜索的值
  const [activeCategory, setActiveCategory] = useState<any>(undefined);
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

  // 使用SWR获取帖子数据
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
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    <div>
      {/* 固定的顶部搜索栏 */}
      <div className="sticky z-10 bg-gray-50/80 backdrop-blur-sm py-2.5">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary/30 hover:bg-gray-100 transition-all border border-gray-200/50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 text-gray-400"
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
                className="flex-1 text-xs sm:text-sm bg-transparent focus:outline-none min-w-0 p-2"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <button
              onClick={handleSearch}
              className="flex-shrink-0 px-3 sm:px-3.5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-xs sm:text-sm shadow-sm hover:shadow"
            >
              搜索
            </button>
          </div>
          <button
            onClick={() =>
              session ? setIsModalOpen(true) : router.push("/api/auth/signin")
            }
            className="flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm hover:shadow"
          >
            <PlusOutlined className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium">发帖</span>
          </button>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-3">
        {/* 帖子列表 */}
        <div className="lg:col-span-3 divide-y divide-gray-100">
          {!data && postsLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 sm:border-3 border-primary border-t-transparent"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
              <div className="text-gray-400 mb-3 text-4xl sm:text-5xl">📝</div>
              <div className="text-gray-600 px-4 text-sm sm:text-base font-medium">
                暂无帖子，来发布第一篇吧
              </div>
            </div>
          ) : (
            <>
              {posts.map((post: any) => (
                <div
                  key={post.id}
                  className="relative bg-white hover:bg-gray-50/50 transition-all duration-300 group overflow-hidden hover:scale-[1.03] hover:shadow-lg hover:z-10"
                >
                  <div className="p-2 sm:p-3">
                    {/* 内容区域和图片区域的弹性布局 */}
                    <div className="flex flex-row gap-3">
                      {/* 左侧内容区域 */}
                      <div className="flex-1 min-w-0">
                        {/* 标题 - 增加视觉层次感 */}
                        <Link href={`/community/${post.id}`} className="block">
                          <h2 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-1 pr-2">
                            {post.title}
                          </h2>
                        </Link>

                        {/* 内容预览 - 改进排版 */}
                        <Link href={`/community/${post.id}`} className="block">
                          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                            {post.content}
                          </p>
                        </Link>
                      </div>

                      {/* 右侧图片区域 */}
                      {post.images && post.images.length > 0 && (
                        <Link
                          href={`/community/${post.id}`}
                          className="block flex-shrink-0 w-16 sm:w-20 md:w-24 mt-0"
                        >
                          <div className="relative overflow-hidden rounded-lg aspect-square bg-gray-100 h-full">
                            <img
                              src={post.images[0]}
                              alt="帖子图片"
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {post.images.length > 1 && (
                              <div className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-md">
                                +{post.images.length - 1}
                              </div>
                            )}
                          </div>
                        </Link>
                      )}
                    </div>

                    <div className="mt-1 sm:mt-1.5 flex flex-wrap items-center justify-between gap-1">
                      {/* 左下角作者和日期信息 - 改进布局 */}
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1.5">
                          {post.author.image ? (
                            <img
                              src={post.author.image}
                              alt={post.author.name || "用户头像"}
                              className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-primary/20 shadow-sm"
                            />
                          ) : (
                            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/10 border-2 border-primary/20 shadow-sm" />
                          )}
                          <span className="text-xs font-medium text-gray-800">
                            {post.author.name || "匿名用户"}
                          </span>
                        </div>

                        {/* 日期 - 改进样式 */}
                        <div className="flex items-center gap-1 text-gray-400 text-xs bg-gray-50 px-1.5 py-0.5 rounded-full">
                          <ClockCircleOutlined className="w-2 h-2" />
                          <span>{dayjs(post.createdAt).fromNow()}</span>
                        </div>

                        {/* 评论数 */}
                        <Link
                          href={`/community/${post.id}`}
                          className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100 text-gray-400 rounded-full px-1.5 py-0.5 text-xs transition-colors"
                        >
                          <MessageOutlined className="w-2 h-2" />
                          <span>{post._count.comments}</span>
                        </Link>

                        {/* 浏览量 */}
                        <div className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100 text-gray-400 rounded-full px-1.5 py-0.5 text-xs transition-colors">
                          <EyeOutlined className="w-2 h-2" />
                          <span>{post.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* 加载更多指示器 */}
          {hasMore && (
            <div
              ref={loadingRef}
              className="flex justify-center items-center py-2.5 sm:py-3"
            >
              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-primary border-t-transparent shadow-sm"></div>
            </div>
          )}
        </div>
      </div>

      {/* 创建帖子模态框 */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          // 刷新数据
          mutate();
        }}
      />
    </div>
  );
}
