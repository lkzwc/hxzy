"use client";

import { signIn } from "next-auth/react";
import { GithubOutlined, GoogleOutlined } from "@ant-design/icons";

export default function SocialLogin() {
  return (
    <div className="mt-4">
      {/* 分割线 */}
      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-xs sm:text-sm">
          <span className="px-4 text-gray-500 bg-neutral-50">
            其他登录方式
          </span>
        </div>
      </div>

      {/* 社交登录按钮 */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => signIn("github")}
          className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium group"
        >
          <GithubOutlined className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>GitHub</span>
        </button>
        
        <button
          type="button"
          onClick={() => signIn("google")}
          className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium group"
        >
          <GoogleOutlined className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Google</span>
        </button>
      </div>
    </div>
  );
}
