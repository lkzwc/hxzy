"use client";
import Footer from "./Footer";
import Header from "./Header";
import VerticalTitle from "./tools/VerticalTitle";
import { usePathname } from "next/navigation";

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

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentPageTitle = pathname ? pageTitles[pathname] : undefined;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

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
