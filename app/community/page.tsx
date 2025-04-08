"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import relativeTime from "dayjs/plugin/relativeTime";
import {EyeOutlined, MessageOutlined, PlusOutlined, HeartOutlined, ClockCircleOutlined } from "@ant-design/icons";
import CreatePostModal from "@/components/CreatePostModal";
import LikeButton from "@/components/LikeButton";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import QrCodeCarousel from '@/components/QrCodeCarousel'
import TagCloudContainer from '@/components/TagCloudContainer'

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
  const [activeCategory, setActiveCategory] = useState("全部");
  const loadingRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // 获取分类数据
  const { data: categoriesData, error: categoriesError } = useSWR<Array<{ name: string, id: number, order: number }>>("/api/categories", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  
  // 处理分类数据，确保始终有"全部"选项
  const categories = categoriesData ? [{ name: "全部", id: 0, order: 0 }, ...categoriesData] : [{ name: "全部", id: 0, order: 0 }];

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
  const { data, error, isLoading: postsLoading, size, setSize, mutate } = useSWRInfinite<PostsResponse>(
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
  const isLoadingMore = postsLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

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
    const tag = searchParams?.get("tag");
    const search = searchParams?.get("search");
    if (tag) {
      setSearchInput("");
      setActiveCategory(tag);
    }
    if (search) {
      setSearchInput(search);
      setSearchQuery(search);
    }
  }, [searchParams]);

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
      <div className="flex justify-center items-center min-h-[200px] text-primary-600">
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
              <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary/30 hover:bg-gray-100 transition-all">
                {/* <Search className="w-4 h-4 text-gray-400 flex-shrink-0" /> */}
                <input
                  type="text"
                  placeholder="搜索感兴趣的内容..."
                  className="flex-1 text-sm sm:text-base bg-transparent focus:outline-none min-w-0 p-2"
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
              <PlusOutlined className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm sm:text-base">发帖</span>
            </button>
          </div>

          {/* 分类标签 - 移动端 */}
          <div className="md:hidden flex items-center gap-2 mt-2 sm:mt-3 overflow-x-auto pb-1 hide-scrollbar">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryChange(category.name)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                  activeCategory === category.name
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
        {/* 帖子列表 */}
        <div className="lg:col-span-4 space-y-3">
          {!data && postsLoading ? (
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
                <div key={post.id} className="relative bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-300
                    border border-gray-100 hover:border-primary/30 group">
                  <Link
                    href={`/community/${post.id}`}
                    target="_blank"
                    className="block p-3 sm:p-4"
                  >
                    <h2 className="text-base sm:text-lg font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                      {post.title}
                    </h2>
                    <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-3 sm:gap-4 text-gray-500">
                      <div className="flex items-center gap-1.5">
                        {post.author.image ? (
                          <img
                            src={post.author.image}
                            alt={post.author.name || "用户头像"}
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
                          />
                        ) : (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-200" />
                        )}
                        <span className="text-sm sm:text-base">{post.author.name || "匿名用户"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <LikeButton 
                          postId={parseInt(post.id)} 
                          initialLikes={post._count.likes} 
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageOutlined className="w-4 h-4" />
                        <span>{post._count.comments}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <EyeOutlined className="w-5 h-5" />
                        <span>{post.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockCircleOutlined className="w-4 h-4" />
                        <span>{dayjs(post.createdAt).fromNow()}</span>
                      </div>
                      
                      {/* 标签展示 */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1 w-full">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span 
                              key={tag} 
                              className="px-2 py-0.5 bg-gray-50 text-gray-500 text-xs rounded-full border border-gray-100"
                            >
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-xs text-gray-400">+{post.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
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

