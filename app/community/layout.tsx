"use client";

import { useState, useEffect, Suspense, createContext } from "react";
import Link from "next/link";
import { UserOutlined, LogoutOutlined, BellOutlined } from "@ant-design/icons";
import {
  RightOutlined,
  AppstoreOutlined,
  TagsOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import QrCodeCarousel from "@/components/QrCodeCarousel";
import useSWR, { mutate as globalMutate } from "swr";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { getTagColor } from "../utils/compassData";
import { Avatar, Button } from "antd";

// 定义获取数据的fetcher函数
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("获取数据失败");
  }
  return res.json();
};

export interface Tag {
  id?: number;
  text: string;
  value: number;
}

export interface DataContextType {
  tags?: Tag[];
  qrData?: any[];
}

export const DataContext = createContext<DataContextType>({});

// 创建一个包含useSearchParams的组件
function SearchParamsProvider({
  children,
}: {
  children: (props: {
    searchParams: ReturnType<typeof useSearchParams>;
    pathname: string;
    router: ReturnType<typeof useRouter>;
  }) => React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  return <>{children({ searchParams, pathname, router })};</>;
}

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const { data: tagData, isLoading: tagLoading } = useSWR("/api/tags", fetcher);
  const tags: Tag[] = tagData?.tags || [];

  // 处理标签数据，确保始终有"全部"选项
  const { data: qrRes, isLoading: qrLoading } = useSWR("/api/tags", fetcher);
  const qrData: any[] = qrRes?.data || [];

  // 获取通知数据
  const { data: notificationData } = useSWR(
    session ? "/api/users/notifications" : null,
    fetcher,
    {
      refreshInterval: 60000, // 每分钟刷新一次
      revalidateOnFocus: false,
    }
  );
  const unreadCount = notificationData?.unreadCount || 0;

  // 侧边栏导航项
  const sidebarItems = [
    { name: "广场", icon: <AppstoreOutlined />, path: "/community" },
    { name: "话题", icon: <TagsOutlined />, path: "/community/topics" },
    {
      name: "消息",
      icon: <BellOutlined />,
      path: "/community/about",
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    { name: "设置", icon: <SettingOutlined />, path: "/community/settings" },
  ];

  // 渲染主要内容
  const renderContent = ({
    searchParams,
  }: {
    searchParams: ReturnType<typeof useSearchParams>;
  }) => (
    <DataContext.Provider value={{ tags, qrData }}>
      <div className=" bg-white h-max">
        <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-6 mt-4">
          {/* 左侧导航栏 - 固定位置 */}
          <div className="sticky top-4 w-[200px] min-w-[180px] hidden md:block">
            {/* 导航菜单卡片 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4 transition-all duration-300 hover:shadow-md">
              <div className="flex flex-col gap-1">
                {sidebarItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium relative ${
                      pathname === item.path
                        ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary shadow-sm border border-primary/20"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className={`text-lg transition-transform duration-200 ${
                      pathname === item.path ? "scale-110" : "group-hover:scale-105"
                    }`}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.name}</span>

                    {/* 通知徽章 */}
                    {(item as any).badge && (
                      <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[18px] h-[18px]">
                        {(item as any).badge > 99 ? '99+' : (item as any).badge}
                      </span>
                    )}

                    {/* 活跃状态指示器 */}
                    {pathname === item.path && !(item as any).badge && (
                      <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* 用户信息卡片 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 transition-all duration-300 hover:shadow-md">
              {session ? (
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar
                      className="ring-2 ring-primary/20 shadow-sm"
                      size={40}
                      src={session?.user?.image}
                    >
                      {(session?.user?.name || "用户")[0].toUpperCase()}
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {session?.user?.name ?? "用户"}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {session?.user?.email}
                    </div>
                  </div>
                  <Button
                    type="text"
                    size="small"
                    className="!text-gray-400 hover:!text-gray-600 !p-1"
                    icon={<LogoutOutlined />}
                    onClick={() => signOut({ callbackUrl: "/" })}
                    title="退出登录"
                  />
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-primary to-primary/90 text-white font-medium rounded-xl hover:from-primary/90 hover:to-primary transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <UserOutlined />
                  登录
                </Link>
              )}
            </div>
          </div>

          {/* 中间内容区 */}
          <div className="flex-1 min-w-0">{children}</div>

          {/* 右侧边栏 - 固定位置 */}
          <div className="w-[280px] hidden lg:block">
            <div className="sticky top-4">
              {/* 热门话题 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4 transition-all duration-300 hover:shadow-md">
                <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-900">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  热门话题
                </h3>
                <div className="flex flex-col gap-1">
                  {tags.map((category: Tag, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-all duration-200 group"
                      onClick={() => {
                        // 创建新的URLSearchParams对象
                        const params = new URLSearchParams(
                          searchParams.toString()
                        );
                        params.set("tag", category.text);
                        // 使用Next.js的router.push方法进行导航
                        router.push(
                          `/community${params.toString() ? `?${params.toString()}` : ""}`
                        );
                        // 使用SWR的mutate函数重新获取数据
                        globalMutate(
                          (key) =>
                            typeof key === "string" &&
                            key.startsWith("/api/posts"),
                          undefined,
                          { revalidate: true }
                        );
                        // 确保页面上的状态也被重置
                        document.dispatchEvent(
                          new CustomEvent("categoryChanged", {
                            detail: category.text,
                          })
                        );
                      }}
                    >
                      <div
                        className={`${getTagColor(category.value)} font-medium transition-colors group-hover:scale-105`}
                      >
                        #{category.text}
                      </div>
                      <div className="text-gray-400 text-xs font-medium bg-gray-100 px-2 py-1 rounded-full">
                        {category.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4 transition-all duration-300 hover:shadow-md">
                <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-900">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  推荐内容
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center text-red-500 flex-shrink-0 group-hover:scale-105 transition-transform">
                      🔥
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href="/community?tag=中医理论"
                        className="text-sm font-medium text-gray-900 hover:text-primary transition-colors line-clamp-1 block"
                      >
                        中医理论基础探讨
                      </Link>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        探讨中医基础理论的应用
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center text-amber-500 flex-shrink-0 group-hover:scale-105 transition-transform">
                      🌿
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href="/community?tag=方剂"
                        className="text-sm font-medium text-gray-900 hover:text-primary transition-colors line-clamp-1 block"
                      >
                        经典方剂分析
                      </Link>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        分享经典方剂的组成与应用
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-emerald-500 flex-shrink-0 group-hover:scale-105 transition-transform">
                      📚
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href="/community?tag=经典"
                        className="text-sm font-medium text-gray-900 hover:text-primary transition-colors line-clamp-1 block"
                      >
                        经典著作解读
                      </Link>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        《黄帝内经》《伤寒论》等解读
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 二维码轮播 */}
              <div className="mt-4">
                <QrCodeCarousel qrCodes={qrData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DataContext.Provider>
  );

  // 使用Suspense包裹SearchParamsProvider组件
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <SearchParamsProvider>
        {(params) => renderContent(params)}
      </SearchParamsProvider>
    </Suspense>
  );
}
