"use client";

import { useState, useEffect, Suspense, createContext } from "react";
import Link from "next/link";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import {
  RightOutlined,
  HomeOutlined,
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

  // 侧边栏导航项
  const sidebarItems = [
    { name: "广场", icon: <AppstoreOutlined />, path: "/community" },
    { name: "话题", icon: <TagsOutlined />, path: "/community/topics" },
    { name: "消息", icon: <HomeOutlined />, path: "/community/about" },
    { name: "设置", icon: <SettingOutlined />, path: "/community/settings" },
  ];

  // 渲染主要内容
  const renderContent = ({
    searchParams,
  }: {
    searchParams: ReturnType<typeof useSearchParams>;
  }) => (
    <DataContext.Provider value={{ tags, qrData }}>
      <div className=" bg-white">
        <div className="flex ml-10 md:ml-20 mt-4">
          {/* 左侧导航栏 - 固定位置 */}
          <div className="sticky w-[180px] border-r-2 hidden md:block">
            {/* 导航菜单 */}
            <div className="rounded-xl p-4 transition-all duration-300">
              <div className="flex flex-col gap-2">
                {sidebarItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm  ${
                      pathname === item.path
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 hover:bg-primary/10 hover:text-gray-600 "
                    } `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="p-4">
              {session ? (
                <div className="flex justify-around items-center">
                  <Avatar
                    className="bg-primary/10 text-primary"
                    size={30}
                    src={session?.user?.image}
                  >
                    {(session?.user?.name || "用户")[0].toUpperCase()}
                  </Avatar>
                  <div>
                    <div className="text-sm text-gray-500">
                      {session?.user?.name ?? session?.user?.email}
                    </div>
                    <Button
                      className="!border-none m-0 !h-2 bg-transparent !text-gray-500 hover:text-gray-600"
                      icon={<LogoutOutlined />}
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      退出
                    </Button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="ml-8 px-6 py-2 bg-primary text-white font-medium rounded-md hover:bg-primary-600 transition-colors"
                >
                  登录
                </Link>
              )}
            </div>
          </div>

          {/* 中间内容区 */}

          <div className="w-[100%] mr-10 lg:mr-0 lg:flex-1 border-r-2 ">{children}</div>

          {/* 右侧边栏 - 固定位置 */}
          <div className="w-[200px] hidden lg:block mr-24">
            <div className="fixed">
              {/* 热门话题 */}
              <div className="p-4  hover:shadow-md transition-all duration-300 mb-2">
                <h3 className="text-base font-medium mb-3 pb-2 flex items-center gap-2">
                  <span className="w-1 h-4 bg-primary rounded-full"></span>
                  热门话题
                </h3>
                <div className="flex flex-col gap-2 ">
                  {tags.map((category: Tag, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 cursor-pointer hover:text-primary transition-colors alias"
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
                        className={`${getTagColor(category.value)} font-medium transition-colors`}
                      >
                        {" "}
                        #{category.text}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {" "}
                        {category.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 hover:shadow-md transition-all duration-300">
                <h3 className="text-base font-medium mb-3 pb-2  flex items-center gap-2">
                  <span className="w-1 h-4 bg-primary rounded-full"></span>
                  广告
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      🔥
                    </div>
                    <div>
                      <Link
                        href="/community?tag=中医理论"
                        className="text-sm font-medium text-gray-900 hover:text-primary transition-colors line-clamp-1"
                      >
                        中医理论基础探讨
                      </Link>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        探讨中医基础理论的应用
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 flex-shrink-0">
                      🌿
                    </div>
                    <div>
                      <Link
                        href="/community?tag=方剂"
                        className="text-sm font-medium text-gray-900 hover:text-primary transition-colors line-clamp-1"
                      >
                        经典方剂分析
                      </Link>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        分享经典方剂的组成与应用
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 flex-shrink-0">
                      📚
                    </div>
                    <div>
                      <Link
                        href="/community?tag=经典"
                        className="text-sm font-medium text-gray-900 hover:text-primary transition-colors line-clamp-1"
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
