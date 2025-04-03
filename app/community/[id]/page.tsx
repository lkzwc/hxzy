"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import relativeTime from "dayjs/plugin/relativeTime";
import { Eye, MessageSquare, Star, Share } from "lucide-react";
import CommentSection from "@/components/CommentSection";
import LikeButton from "@/components/LikeButton";

// 配置 dayjs
dayjs.locale("zh-cn");
dayjs.extend(relativeTime);

interface Author {
  id: number;
  name: string | null;
  image: string | null;
}

interface Comment {
  id: number;
  content: string;
  images: string[];
  createdAt: string;
  author: Author;
  parentId: number | null;
}

interface Post {
  id: number;
  title: string;
  content: string;
  images: string[];
  createdAt: string;
  views: number;
  _count: {
    postLikes: number;
    comments: number;
  };
  tags: string[];
  author: Author;
  comments: Comment[];
}

export default function PostDetail({ params }: { params: { id: string } }) {
  // 使用React.use()解包params
  const resolvedParams: any = React.use(params);
  const postId = resolvedParams.id;

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [commentImages, setCommentImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (!response.ok) {
        throw new Error("获取帖子详情失败");
      }
      const data = await response.json();

      // 确保数据结构符合接口定义
      const formattedPost: Post = {
        ...data,
        _count: {
          postLikes: data._count?.postLikes || 0,
          comments: data._count?.comments || 0,
        },
      };

      setPost(formattedPost);
    } catch (err) {
      setError(err instanceof Error ? err.message : "未知错误");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("上传失败");
      }

      const data = await response.json();
      setCommentImages((prev) => [...prev, ...data.urls]);
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("图片上传失败，请重试");
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      router.push("/login");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          images: commentImages,
        }),
      });

      if (!response.ok) {
        throw new Error("评论失败");
      }

      const newComment = await response.json();
      setPost((prev) =>
        prev
          ? {
              ...prev,
              comments: [...prev.comments, newComment],
            }
          : null
      );
      setComment("");
      setCommentImages([]);
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("评论失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex justify-center items-center min-h-screen text-primary-600">
        {error || "帖子不存在"}
      </div>
    );
  }

  return (
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-6">
        {/* 左侧边栏 - 作者信息和交互按钮 */}
        <div className="w-[80px] hidden md:block flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-6 hover:shadow-md transition-all duration-300">
            {/* 作者信息 */}
            <div className="flex flex-col items-center text-center mb-4 pb-4 border-b border-gray-100">
              <div className="relative w-16 h-16 mb-3">
                <Image
                  src={post.author.image || "/images/default-avatar.png"}
                  alt={post.author.name || "用户"}
                  fill
                  sizes="(max-width: 64px) 100vw, 64px"
                  priority
                  className="rounded-full object-cover border-2 border-white shadow-sm"
                />
              </div>
              <div className="font-medium text-gray-900 mb-1 text-sm">
                {post.author.name || "匿名用户"}
              </div>
              <button className="w-full py-1.5 bg-primary text-white rounded-full text-xs font-medium hover:bg-primary/90 transition-colors">
                关注
              </button>
            </div>

            {/* 交互按钮 */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col items-center">
                <LikeButton
                  postId={post.id}
                  initialLikes={post._count.postLikes}
                  className="!flex-col !gap-1"
                />
              </div>
              <div className="flex flex-col items-center text-gray-500 hover:text-primary transition-colors cursor-pointer">
                <MessageSquare className="w-6 h-6" />
                <span className="text-xs mt-1">{post._count.comments}</span>
              </div>
              <div className="flex flex-col items-center text-gray-500 hover:text-amber-500 transition-colors cursor-pointer">
                <Star className="w-6 h-6" />
                <span className="text-xs mt-1">收藏</span>
              </div>
              <div className="flex flex-col items-center text-gray-500 hover:text-emerald-500 transition-colors cursor-pointer">
                <Share className="w-6 h-6" />
                <span className="text-xs mt-1">分享</span>
              </div>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="flex-1 min-w-0">
          {/* 帖子内容卡片 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-all duration-300">
            {/* 帖子标题和元信息 */}
            <div className="border-b border-gray-100 pb-4 mb-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  {post.author.image ? (
                    <Image
                      src={post.author.image}
                      alt={post.author.name || "用户头像"}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-200" />
                  )}
                  <span>{post.author.name || "匿名用户"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>{post.views} 次浏览</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{dayjs(post.createdAt).format("YYYY年MM月DD日 HH:mm")}</span>
                </div>
              </div>
              
              {/* 标签展示 */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {post.tags.map((tag) => (
                    <Link 
                      key={tag} 
                      href={`/community?tag=${encodeURIComponent(tag)}`}
                      className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-full hover:bg-gray-100 transition-colors border border-gray-100"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 帖子内容 */}
            <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
              {post.content}
            </div>

            {/* 帖子图片 */}
            {post.images && post.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {post.images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-100">
                    <Image
                      src={image}
                      alt={`帖子图片 ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 移动端交互按钮 */}
            <div className="md:hidden flex justify-around mt-6 pt-4 border-t border-gray-100">
              <div className="flex flex-col items-center">
                <LikeButton
                  postId={post.id}
                  initialLikes={post._count.postLikes}
                  className="!flex-col !gap-1"
                />
              </div>
              <div className="flex flex-col items-center text-gray-500">
                <MessageSquare className="w-6 h-6" />
                <span className="text-xs mt-1">{post._count.comments}</span>
              </div>
              <div className="flex flex-col items-center text-gray-500">
                <Star className="w-6 h-6" />
                <span className="text-xs mt-1">收藏</span>
              </div>
              <div className="flex flex-col items-center text-gray-500">
                <Share className="w-6 h-6" />
                <span className="text-xs mt-1">分享</span>
              </div>
            </div>
          </div>

          {/* 评论区 */}
          <div className="mt-4 sm:mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded-full"></span>
              评论区 ({post._count.comments})
            </h2>
            <CommentSection
              postId={post.id}
              comments={post.comments}
              onCommentAdded={(newComment) => {
                setPost((prev) =>
                  prev
                    ? {
                        ...prev,
                        comments: [...prev.comments, newComment],
                        _count: {
                          ...prev._count,
                          comments: prev._count.comments + 1,
                        },
                      }
                    : null
                );
              }}
            />
          </div>
        </div>
      </div>
  );
}
