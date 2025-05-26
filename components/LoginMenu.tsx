'use client'

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import NotificationBadge from "./NotificationBadge";

export function LoginMenu() {
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);

  // 处理加载状态
  if (status === "loading") {
    return (
      <div className="h-8 w-24 bg-white/10 animate-pulse rounded-md">
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // 处理错误状态或未登录状态
  if (status === "unauthenticated" || !session) {
    return (
      <Link
        href="/login"
        className="ml-8 px-6 py-2 bg-primary text-white font-medium rounded-md hover:bg-primary-600 transition-colors"
      >
        登录
      </Link>
    );
  }

  return (
    <div className="relative inline-block text-left flex items-center">
      {/* 通知图标 */}
      <NotificationBadge />
      
      <div
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 cursor-pointer ml-2"
      >
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || '用户头像'}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-primary text-sm font-medium">
              {(session.user?.name || '用户')[0].toUpperCase()}
            </span>
          )}
        </div>
        <span className="text-white font-medium hover:text-white/90 transition-colors">
          {session.user?.name || '用户'}
        </span>
      </div>

      {showDropdown && (
        <div 
          className="flex md:grid absolute md:right-0 mt-2 w-max rounded-md shadow-lg bg-white ring-1 ring-primary ring-opacity-5 divide-y divide-neutral-100 focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu"
        >
          <div className="py-1" role="none">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50"
              role="menuitem"
              onClick={() => setShowDropdown(false)}
            >
              个人中心
            </Link>
          </div>
          <div className="py-1" role="none">
            <button
              onClick={() => {
                setShowDropdown(false);
                signOut({ callbackUrl: '/' });
              }}
              className="w-full text-left block px-4 py-2 text-sm text-primary-600 hover:bg-primary-50"
              role="menuitem"
            >
              退出登录
            </button>
          </div>
        </div>
      )}
    </div>
  );
}