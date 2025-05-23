"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { RightOutlined } from "@ant-design/icons";
import QrCodeCarousel from "@/components/QrCodeCarousel";
import useSWR, { mutate as globalMutate } from "swr";
import TagCloudContainer from "@/components/TagCloudContainer";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// 定义获取数据的fetcher函数
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("获取数据失败");
  }
  return res.json();
};

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
  
  return <>{children({ searchParams, pathname, router })}</>;
}

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [qrCodes, setQrCodes] = useState([]);
  const pathname = usePathname(); // 这个可以保留在外层，不需要Suspense
  const router = useRouter(); // 这个也可以保留在外层
  
  // 获取分类数据
  const { data: categoriesData } = useSWR<
    Array<{ name: string; id: number; order: number }>
  >("/api/categories", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  
  // 使用Suspense包裹SearchParamsProvider组件


  // 处理分类数据，确保始终有"全部"选项
  const categories = categoriesData
    ? [{ name: "全部", id: 0, order: 0 }, ...categoriesData]
    : [{ name: "全部", id: 0, order: 0 }];
    
  useEffect(() => {
    // 获取二维码数据
    fetch("/api/qrcodes")
      .then((res) => {
        console.log(res);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => setQrCodes(data))
      .catch((error) => console.error("Error fetching QR codes:", error));
  }, []);
  
   // 渲染主要内容
   const renderContent = ({ searchParams }: { searchParams: ReturnType<typeof useSearchParams> }) => (
    <div className="container mx-auto max-w-7xl">
      <div className="flex gap-4 mt-4 sm:ml-16">
        {/* 左侧筛选区 - 固定位置 */}
        {
          pathname === '/community' && <div className="w-[180px] hidden md:grid">
          <div className="fixed w-[180px]">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all duration-300">
              <h3 className="text-base font-medium mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full"></span>
                分类筛选
              </h3>
              <div className="flex flex-col gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id || category.name}
                    onClick={() => {
                      // 创建新的URLSearchParams对象
                      const params = new URLSearchParams(searchParams.toString());
                      if (category.name === "全部") {
                        // 清空所有筛选条件
                        params.delete('tag');
                        params.delete('search');
                      } else {
                        params.set('tag', category.name);
                      }
                      // 使用Next.js的router.push方法进行导航
                      router.push(`/community${params.toString() ? `?${params.toString()}` : ''}`);
                      // 使用SWR的mutate函数重新获取数据
                      // 强制刷新所有帖子相关的数据
                      globalMutate(
                        (key) => typeof key === 'string' && key.startsWith('/api/posts'),
                        undefined,
                        { revalidate: true }
                      );
                      // 确保页面上的状态也被重置
                      document.dispatchEvent(new CustomEvent('categoryChanged', { detail: category.name }));
                    }}
                    className={`px-3 py-2 rounded-md transition-colors text-sm hover:bg-gray-50 ${
                      pathname === '/community' && searchParams.get('tag') === category.name
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-gray-600'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 relative">
              <TagCloudContainer />
            </div>
          </div>
        </div>
        }

        {/* 中间内容区 */}
        <div className="flex-1 min-w-0">{children}</div>

        {/* 右侧边栏 - 固定位置 */}
        <div className="w-[240px] hidden lg:block">
          <div className="fixed w-[240px] space-y-4">
            {/* 热门话题 */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all duration-300">
              <h3 className="text-base font-medium mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full"></span>
                热门话题
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    🔥
                  </div>
                  <div>
                    <Link href="/community?tag=中医理论" className="text-sm font-medium text-gray-900 hover:text-primary transition-colors line-clamp-1">
                      中医理论基础探讨
                    </Link>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">探讨中医基础理论的应用</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 flex-shrink-0">
                    🌿
                  </div>
                  <div>
                    <Link href="/community?tag=方剂" className="text-sm font-medium text-gray-900 hover:text-primary transition-colors line-clamp-1">
                      经典方剂分析
                    </Link>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">分享经典方剂的组成与应用</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 flex-shrink-0">
                    📚
                  </div>
                  <div>
                    <Link href="/community?tag=经典" className="text-sm font-medium text-gray-900 hover:text-primary transition-colors line-clamp-1">
                      经典著作解读
                    </Link>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">《黄帝内经》《伤寒论》等解读</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 二维码轮播 */}
            <div className="mt-4">
              <QrCodeCarousel qrCodes={qrCodes} />
            </div>
          </div>
        </div>
      </div>
    </div>
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
