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
  const [page, setPage] = useState(1);
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

  useEffect(() => {
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    setActiveCategory(tag || "全部");
    if (search) {
      setSearchInput(search);
      setSearchQuery(search);
    }
  }, [searchParams]);

  useEffect(() => {
    setSize(1); // 重置到第一页
  }, [activeCategory, searchQuery, setSize]);

  // 处理搜索
  const triggerSearch = () => {
    if (searchInput.trim() !== searchQuery) {
      setSearchQuery(searchInput.trim());
    }
  };

  // 处理回车搜索
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      triggerSearch();
    }
  };

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
    <div className="max-w-6xl mx-6 pb-10">
      {/* 固定的顶部搜索栏 */}
      <div className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-sm p-2 sm:p-4 border border-gray-100">
          {/* 搜索和发帖按钮 */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="搜索感兴趣的内容..."
              className="flex-1 pl-2 py-1 text-sm bg-gray-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all hover:bg-gray-100"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              type="button"
              className="p-2 text-primary hover:text-primary/70 transition-colors"
              onClick={triggerSearch}
            >
              <Search theme="outline" size="24" />
            </button>
            <button
              onClick={() =>
                session ? setIsModalOpen(true) : router.push("/api/auth/signin")
              }
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors sm:w-auto w-full"
            >
              <Plus theme="outline" size="18" />
              <span>发帖</span>
            </button>
          </div>
        </div>
      </div>

      {/* 帖子列表 */}
      <div className="space-y-2 mt-4">
        {!data && isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-white rounded-xl border border-gray-100">
            <div className="text-gray-400 mb-2 text-4xl sm:text-5xl">📝</div>
            <div className="text-gray-500 px-4">暂无帖子，来发布第一篇吧</div>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/community/${post.id}`}
                className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300
                  border border-gray-100 hover:border-primary/30 group"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <img
                      src={post.author.image || "/images/default-avatar.png"}
                      alt={post.author.name || "用户"}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full shrink-0 border-2 border-white shadow-sm
                        group-hover:ring-2 group-hover:ring-primary/20 transition-all"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 sm:mb-2.5 gap-2 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                            {post.title}
                          </h2>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-medium text-primary/90">
                              {post.author.name || "匿名用户"}
                            </span>
                            <span className="inline-block w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="text-xs text-gray-400">
                              {dayjs(post.createdAt).format("MM月DD日 HH:mm")}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 sm:gap-5 text-sm text-gray-400/90 shrink-0">
                          <span className="flex items-center gap-1.5 hover:text-primary/70 transition-colors">
                            <Eyes theme="outline" size="16" />
                            <span>{post.views}</span>
                          </span>
                          <span className="flex items-center gap-1.5 hover:text-primary/70 transition-colors">
                            <Like theme="outline" size="16" />
                            <span>{post._count.postLikes}</span>
                          </span>
                          <span className="flex items-center gap-1.5 hover:text-primary/70 transition-colors">
                            <Comment theme="outline" size="16" />
                            <span>{post._count.comments}</span>
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2 text-sm leading-relaxed">
                        {post.content}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-xs bg-primary/5 text-primary rounded-full border border-primary/10
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

            {/* 加载更多指示器 */}
            <div ref={loadingRef} className="py-4 text-center">
              {isLoadingMore ? (
                <div className="flex justify-center items-center h-8">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : hasMore ? (
                <span className="text-sm text-gray-500">下拉加载更多</span>
              ) : (
                <span className="text-sm text-gray-500">已经到底啦 ~</span>
              )}
            </div>
          </>
        )}
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setSize(1); // 重置到第一页
          mutate();
        }}
      />
    </div>
  );
}
