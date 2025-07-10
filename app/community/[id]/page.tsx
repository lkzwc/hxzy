"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  EyeOutlined,
  MessageOutlined,
  StarOutlined,
  ShareAltOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import CommentSection from "@/components/CommentSection";
import LikeButton from "@/components/LikeButton";
import { message, Result } from "antd";

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

export default function PostDetail({ params }: any) {
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
  const [messageApi, contextHolder] = message.useMessage();
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
      message.warning("图片上传失败，请重试");
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
              comments: [...prev.comments ?? [], newComment],
            }
          : null
      );
      setComment("");
      setCommentImages([]);
    } catch (error) {
      console.error("Error submitting comment:", error);
      message.warning("评论失败，请重试");
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
      <Result
        status="404"
        title="暂无数据"
        subTitle="Sorry, the page you visited does not exist."
      />
    );
  }

  return (
    <div className="flex border-l flex-col md:flex-row gap-6 max-w-7xl mx-auto py-2">
      {/* 返回按钮 */}

      {contextHolder}

      {/* 主要内容区域 */}
      <div className="flex-1 min-w-0">
        <div className="w-full mb-2">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>返回帖子列表</span>
          </button>
        </div>

        {/* 帖子内容卡片 */}
        <div className="p-5 sm:p-7 bg-[#f9f9f9] transition-all duration-300">
          {/* 帖子元信息 */}
          <div className="border-gray-100 pb-5 mb-5">
            {/* 作者信息和发布时间 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                  <Image
                    src={post.author.image || "/images/defaultAvatar.jpg"}
                    alt={post.author.name || "用户"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {post.author.name || "匿名用户"}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <ClockCircleOutlined className="mr-1" />
                    {dayjs(post.createdAt).fromNow()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center text-primary-600 hover:text-primary-700 transition-colors">
                  <EyeOutlined className="mr-1" /> {post.views}
                </span>
                <span className="flex items-center text-primary-600 hover:text-primary-700 transition-colors">
                  <MessageOutlined className="mr-1" /> {post._count.comments}
                </span>
              </div>
            </div>

            {/* 标签展示 - 优化样式 */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {post.tags.map((tag, index) => {
                  // 为标签分配不同的颜色 - 使用中医主题色系
                  const colors = [
                    "primary",
                    "secondary",
                    "accent",
                    "amber",
                    "emerald",
                    "orange",
                  ];
                  const color = colors[index % colors.length];

                  return (
                    <Link
                      key={tag}
                      href={`/community?tag=${encodeURIComponent(tag)}`}
                      className={`px-3 py-1.5 bg-${color}-100 text-${color}-600 text-xs font-medium rounded-full 
                        hover:bg-${color}-200 transition-all duration-300 border border-${color}-200 
                        hover:shadow-md transform hover:-translate-y-0.5`}
                    >
                      #{tag}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* 帖子内容 - 优化排版 */}
          <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap break-words p-4 sm:p-6 rounded-lg shadow-inner">
            {post.content}
          </div>

          {/* 帖子图片 - 优化布局和效果 */}
          {post.images && post.images.length > 0 && (
            <div className="mt-6 mb-4">
              <h3 className="text-sm font-medium text-gray-600 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                图片附件 ({post.images.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {post.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group"
                  >
                    <Image
                      src={image}
                      alt={`帖子图片 ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                      <span className="text-white text-xs font-medium px-3 py-1 bg-black/30 rounded-full backdrop-blur-sm">
                        查看大图
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between w-full pt-5">
            <div className="flex items-center w-full px-2">
              <LikeButton
                postId={post.id}
                initialLikes={post._count.postLikes}
                className="!flex w-full text-base"
              />
            </div>
            <div className="flex items-center w-full px-2 text-gray-500 hover:text-primary transition-colors cursor-pointer">
              <MessageOutlined className="w-5 h-5" />
              <span className="text-sm ml-2">{post._count.comments}</span>
            </div>
            <div className="flex items-center w-full px-2 text-gray-500 hover:text-amber-500 transition-colors cursor-pointer">
              <StarOutlined className="w-5 h-5" />
              <span className="text-sm ml-2">收藏</span>
            </div>
            <div className="flex items-center w-full px-2 text-gray-500 hover:text-emerald-500 transition-colors cursor-pointer">
              <ShareAltOutlined className="w-5 h-5" />
              <span className="text-sm ml-2">分享</span>
            </div>
          </div>
        </div>

        {/* 评论区 - 优化样式 */}
        <div className="p-5 sm:p-7 hover:shadow-lg border-t transition-all duration-300">
          <h2 className="text-lg font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-200 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-primary rounded-full"></span>
            <MessageOutlined className="text-primary mr-2 text-lg" />
            评论区{" "}
            <span className="ml-2 bg-primary-100 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {post._count.comments}
            </span>
          </h2>
          <CommentSection
            postId={post.id}
            comments={post.comments}
            onCommentAdded={(newComment) => {
              setPost((prev) =>
                prev
                  ? {
                      ...prev,
                      comments: [...prev?.comments ?? [], newComment],
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
