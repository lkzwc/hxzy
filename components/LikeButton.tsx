"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import useSWR from "swr";

interface LikeButtonProps {
  postId: number | string;
  initialLikes?: number;
  className?: string;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function LikeButton({
  postId,
  initialLikes = 0,
  className = "",
}: LikeButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 获取点赞状态
  const { data, mutate } = useSWR(
    session ? `/api/posts/${postId}/like` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const likes = data?.likes ?? initialLikes;
  const isLiked = data?.isLiked ?? false;

  // 使用useRef存储上次点击的时间戳，用于实现防抖
  const lastClickTimeRef = useRef(0);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); // 阻止链接跳转
    e.stopPropagation(); // 阻止事件冒泡

    if (!session) {
      router.push("/api/auth/signin");
      return;
    }

    // 防抖处理：如果距离上次点击不足500ms，则忽略本次点击
    const now = Date.now();
    if (now - lastClickTimeRef.current < 500 || isLoading) return;
    lastClickTimeRef.current = now;

    try {
      setIsLoading(true);

      // 立即乐观更新UI状态
      const optimisticData = {
        isLiked: !isLiked,
        likes: isLiked ? likes - 1 : likes + 1,
      };

      // 使用乐观更新，即使API调用失败也会回滚
      await mutate(optimisticData, false);

      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to like");

      const data = await res.json();
      // 使用服务器返回的实际数据更新
      mutate(data, false);
    } catch (error) {
      console.error("点赞失败:", error);
      // 发生错误时，重新获取正确的数据
      mutate();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`group flex items-center gap-1 transition-colors ${className}`}
    >
      {isLiked ? (
        <div>
          <HeartFilled className="w-4 h-4 flex-shrink-0 scale-100 transition-colors caret-red-600" />
        </div>
      ) : (
        <div>
          <HeartOutlined className="w-4 h-4 flex-shrink-0 transition-colors group-hover:text-rose-500" />
        </div>
      )}
      <span>{likes}</span>
    </button>
  );
}
