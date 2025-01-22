'use client'

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

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
        className="ml-8 px-6 py-2 bg-secondary text-background font-medium rounded-md hover:bg-secondary/90 transition-colors"
      >
        登录
      </Link>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <div
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center overflow-hidden">
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || '用户头像'}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-secondary text-sm font-medium">
              {(session.user?.name || '用户')[0].toUpperCase()}
            </span>
          )}
        </div>
        <span className="text-background font-medium hover:text-background/90 transition-colors">
          {session.user?.name || '用户'}
        </span>
      </div>

      {showDropdown && (
        <div 
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu"
        >
          <div className="py-1" role="none">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
              className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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