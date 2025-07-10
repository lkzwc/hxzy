"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Footer from "./Footer";
import VerticalTitle from "./tools/VerticalTitle";


// 页面标题配置
const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/tools": {
    title: "中医工具",
    subtitle: "传统智慧",
  },
  "/about": {
    title: "关于我们",
    subtitle: "健康人生",
  },
  "/zhongyidb": {
    title: "中医数据库",
    subtitle: "包括药材、经方、医案",
  },
  "/community": {
    title: "中医社区",
    subtitle: "中医爱好者交流地",
  },
  "/doctors": {
    title: "全国名医",
    subtitle: "中医大家",
  },
};

const menuItems = [
  { name: "首页", path: "/", description: "首页" },
  { name: "中医工具", path: "/tools", description: "中医工具" },
  { name: "中医社区", path: "/community", description: "中医爱好者交流地" },
  { name: "中医数据库", path: "/zhongyidb", description: "中医数据库" },
  { name: "全国名医", path: "/doctors", description: "中医大家" },
  { name: "关于我们", path: "/about", description: "关于我们" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();

  // 获取当前页面的标题配置
  const currentPageTitle = pathname ? pageTitles[pathname] : undefined;

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* 毛玻璃效果背景 */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/95 to-primary-500/95 backdrop-blur-md shadow-lg" />

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

      {/* 移动端菜单 */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-100 z-40" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0 z-50" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              导航菜单
            </span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="关闭菜单"
            >
              <svg
                className="w-6 h-6 text-gray-500"
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
          <nav className="flex-1 overflow-y-auto">
            <ul className="p-4 space-y-1">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      pathname === item.path
                        ? "bg-primary-50 text-primary-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* 添加占位元素 */}
      <div className="h-[64px]" />

      <main className="flex-1 relative">
        {currentPageTitle && (
          <VerticalTitle
            title={currentPageTitle.title}
            subtitle={currentPageTitle.subtitle}
          />
        )}
        {children}
      </main>

      <Footer />
    </div>
  );
}
