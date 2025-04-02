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
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* 左侧边栏 - 作者信息和交互按钮 */}
        <div className="w-[150px] hidden md:block flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-6">
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
              <div className="text-xs text-gray-500 mb-3">
                {dayjs(post.createdAt).format("YYYY年MM月DD日")}
              </div>
              <button className="w-full py-1.5 px-3 bg-primary text-white rounded-full text-xs font-medium hover:bg-primary/90 transition-colors">
                关注
              </button>
            </div>

            {/* 交互按钮 */}
            <div className="space-y-3">
              <div className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <LikeButton
                  postId={post.id}
                  initialLikes={post._count.postLikes}
                  className="flex-col !gap-1.5"
                />
              </div>

              <div className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex flex-col items-center gap-1.5 text-gray-500">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-xs">{post._count.comments}</span>
                </div>
              </div>

              <div className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex flex-col items-center gap-1.5 text-gray-500">
                  <Star className="w-5 h-5" />
                  <span className="text-xs">收藏</span>
                </div>
              </div>

              <div className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex flex-col items-center gap-1.5 text-gray-500">
                  <Share className="w-5 h-5" />
                  <span className="text-xs">分享</span>
                </div>
              </div>

              <div className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex flex-col items-center gap-1.5 text-gray-500">
                  <Eye className="w-5 h-5" />
                  <span className="text-xs">{post.views}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧主内容区 */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* 帖子内容 */}
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-snug">
                {post.title}
              </h1>
              <article className="prose prose-gray max-w-none mb-6">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {post.content}
                </p>
              </article>

              {post.images?.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {post.images.map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden shadow-sm group"
                    >
                      <Image
                        src={url}
                        alt={`图片 ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              )}

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6 pt-2 border-t border-gray-100">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 text-sm bg-primary-50 text-primary rounded-full 
                        hover:bg-primary hover:text-white transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="border-t rounded-xl border-gray-100 bg-gray-50/50 mt-3">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
                <span>评论</span>
                <span className="text-sm font-normal text-gray-500">
                  ({post.comments.length})
                </span>
              </h2>

              {/* 使用 CommentSection 组件 */}
              <CommentSection
                postId={post.id}
                comments={post.comments}
                onCommentAdded={(newComment) => {
                  setPost((prev) =>
                    prev
                      ? {
                          ...prev,
                          comments: [...prev.comments, newComment],
                        }
                      : null
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
