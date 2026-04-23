"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const menuItems = [
  { name: "首页", path: "/", description: "首页", icon: "🏠" },
  { name: "中医工具", path: "/tools", description: "中医工具", icon: "🔧" },
  { name: "中医社区", path: "/community", description: "中医爱好者交流地", icon: "👥" },
  { name: "中医数据库", path: "/zhongyidb", description: "中医数据库", icon: "📚" },
  { name: "全国名医", path: "/doctors", description: "中医大家", icon: "👨‍⚕️" },
  { name: "关于我们", path: "/about", description: "关于我们", icon: "ℹ️" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // 防止菜单打开时页面滚动
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // 键盘导航支持
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* 毛玻璃效果背景 */}
        <div className="absolute inset-0 bg-gradient-to-r bg-primary/95 to-primary-600/95 backdrop-blur-md shadow-lg" />

        <div className="relative px-4 md:px-8 py-4">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <Link
              href="/"
              className="text-2xl font-bold text-white flex items-center gap-2 group"
            >
              <span
                className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center
                group-hover:bg-white/20 transition-colors"
              >
                华
              </span>
              <span className="group-hover:text-white/90 transition-colors">
                华夏中医
              </span>
            </Link>

            {/* 移动端菜单按钮 */}
            <button
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* 桌面端导航 */}
            <nav className="hidden md:flex items-center gap-2">
              <ul className="flex items-center gap-1">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.path}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                        ${
                          pathname === item.path
                            ? "bg-white/15 text-white"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* 移动端菜单遮罩 */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-100 z-40" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />
      
      {/* 移动端侧边菜单 */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0 z-50" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* 菜单头部 */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-6 text-white">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="关闭菜单"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* 菜单内容 */}
          <nav className="flex-1 overflow-y-auto bg-white" role="navigation" aria-label="主导航菜单">
            <ul className="p-4 space-y-2" role="menu">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`flex items-center px-4 py-4 rounded-xl transition-all duration-200 group touch-manipulation ${
                      pathname === item.path
                        ? "bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 shadow-sm border border-primary-100"
                        : "text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-600 active:bg-primary-100"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                    role="menuitem"
                  >
                    <span className="text-2xl mr-4 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <div className="flex-1">
                      <div className="font-semibold text-base">{item.name}</div>
                      <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                    </div>
                    <svg
                      className={`w-5 h-5 transition-transform ${
                        pathname === item.path ? "text-primary-500" : "text-gray-400 group-hover:text-primary-500"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 菜单底部 */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="text-center text-sm text-gray-500">
              <p>华夏中医 · 传承千年智慧</p>
              <p className="mt-1 text-xs">© 2024 版权所有</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
