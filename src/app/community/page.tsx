"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { Search, Eyes, Like, Comment, Plus } from "@icon-park/react";
import CreatePostModal from "@/components/CreatePostModal";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

// 配置 dayjs
dayjs.locale("zh-cn");

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
  posts: Post[];
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
  const [activeCategory, setActiveCategory] = useState("全部");
  const loadingRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // 构建查询参数
  const getQueryParams = (pageNum: number) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (activeCategory !== "全部") params.set("tag", activeCategory);
    params.set("page", pageNum.toString());
    params.set("limit", "10");
    return params.toString();
  };

  // 使用SWR获取帖子数据
  const { data, error, isLoading, size, setSize, mutate } = useSWRInfinite<PostsResponse>(
    (index) => `/api/posts?${getQueryParams(index + 1)}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateFirstPage: false,
    }
  );

  // 合并所有页面的数据
  const posts = data ? data.flatMap(page => page.posts) : [];
  const hasMore = data ? data[data.length - 1]?.hasMore : true;
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  // 处理搜索和分类筛选
  const handleSearch = () => {
    const trimmedInput = searchInput.trim();
    setSearchQuery(trimmedInput);
    
    // 更新 URL 参数
    const params = new URLSearchParams();
    if (trimmedInput) {
      params.set("search", trimmedInput);
    }
    if (activeCategory !== "全部") {
      params.set("tag", activeCategory);
    }
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.pushState({}, '', newUrl);
    
    // 重置页码并重新获取数据
    setSize(1);
  };

  // 处理分类切换
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSearchInput(""); // 清空搜索框
    setSearchQuery(""); // 清空搜索查询
    
    // 更新 URL 参数
    const params = new URLSearchParams();
    if (category !== "全部") {
      params.set("tag", category);
    }
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.pushState({}, '', newUrl);
    
    // 重置页码并重新获取数据
    setSize(1);
  };

  // 处理回车搜索
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // 初始化搜索和分类参数
  useEffect(() => {
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    if (tag) {
      setSearchInput("");
      setActiveCategory(tag);
    }
    if (search) {
      setSearchInput(search);
      setSearchQuery(search);
    }
  }, []);

  // 监听滚动加载
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isLoadingMore) {
          setSize(size => size + 1);
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
      <div className="flex justify-center items-center min-h-[200px] text-red-500">
        获取帖子列表失败
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 pb-4 sm:pb-10">
      {/* 固定的顶部搜索栏 */}
      <div className="sticky top-14 z-10 bg-gray-50/80 backdrop-blur-sm py-2">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-2 sm:p-4 border border-gray-100">
          {/* 搜索和发帖按钮 */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-primary/20 hover:bg-gray-100 transition-all">
                <Search theme="outline" size="18" className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="搜索感兴趣的内容..."
                  className="flex-1 text-sm sm:text-base bg-transparent focus:outline-none min-w-0"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <button
                onClick={handleSearch}
                className="flex-shrink-0 px-3 sm:px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
              >
                搜索
              </button>
            </div>
            <button
              onClick={() => session ? setIsModalOpen(true) : router.push('/api/auth/signin')}
              className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus theme="outline" size="18" className="flex-shrink-0" />
              <span className="text-sm sm:text-base">发帖</span>
            </button>
          </div>

          {/* 分类标签 */}
          <div className="flex items-center gap-2 mt-2 sm:mt-3 overflow-x-auto pb-1 hide-scrollbar">
            {['全部', '经方', '养生', '针灸', '中药', '诊断', '心得'].map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base whitespace-nowrap transition-colors ${
                  activeCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 帖子列表 */}
      <div className="space-y-2 sm:space-y-4 mt-3">
        {!data && isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 sm:border-3 border-primary border-t-transparent"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-lg sm:rounded-xl border border-gray-100">
            <div className="text-gray-400 mb-2 text-3xl sm:text-4xl">📝</div>
            <div className="text-gray-500 px-4 text-sm sm:text-base">暂无帖子，来发布第一篇吧</div>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/community/${post.id}`}
                className="block bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-300
                  border border-gray-100 hover:border-primary/30 group"
              >
                <div className="p-3 sm:p-4">
                  <div className="flex items-start gap-2 sm:gap-4">
                    <img
                      src={post.author.image || '/images/default-avatar.png'}
                      alt={post.author.name || '用户'}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shrink-0 border-2 border-white shadow-sm
                        group-hover:ring-2 group-hover:ring-primary/20 transition-all"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-base sm:text-lg font-medium text-gray-900 group-hover:text-primary 
                            transition-colors line-clamp-1 mb-1"
                          >
                            {post.title}
                          </h2>
                          <div className="flex items-center gap-2 text-xs sm:text-sm">
                            <span className="font-medium text-primary/90">
                              {post.author.name || '匿名用户'}
                            </span>
                            <span className="inline-block w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="text-gray-400">
                              {dayjs(post.createdAt).format('MM月DD日 HH:mm')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-400/90 shrink-0">
                          <span className="flex items-center gap-1">
                            <Eyes theme="outline" size="16" className="flex-shrink-0" />
                            <span>{post.views}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Like theme="outline" size="16" className="flex-shrink-0" />
                            <span>{post._count.postLikes}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Comment theme="outline" size="16" className="flex-shrink-0" />
                            <span>{post._count.comments}</span>
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2 line-clamp-2 text-sm sm:text-base leading-relaxed">
                        {post.content}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-primary/5 text-primary rounded-full border border-primary/10
                              group-hover:bg-primary/10 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </>
        )}

        {/* 加载更多指示器 */}
        {hasMore && (
          <div
            ref={loadingRef}
            className="flex justify-center items-center py-4 sm:py-6"
          >
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 sm:border-3 border-primary border-t-transparent"></div>
          </div>
        )}
      </div>

      {/* 创建帖子模态框 */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          mutate();
        }}
      />

      {/* 返回顶部按钮 */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 p-2 sm:p-3 bg-white rounded-full shadow-lg hover:shadow-xl
          border border-gray-200 hover:border-primary/30 transition-all group z-50"
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-primary transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </div>
  )
}

