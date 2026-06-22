import { Suspense } from 'react';
import type { Metadata } from 'next';
import TimeTable from '@/components/tools/TimeTable';
import ToolsClient from './ToolsClient';

export const metadata: Metadata = {
  title: '中医工具 - 小六壬、紫微斗数、AI助手',
  description: '华夏中医药用工具集，包含小六壬占卜、紫微斗数命盘、AI中医助手、十二时辰对照表等传统中医与玄学工具。',
  keywords: ['小六壬', '紫微斗数', 'AI中医', '中医工具', '十二时辰', '占卜', '命盘', '辅助诊断'],
  openGraph: {
    title: '中医工具 - 小六壬、紫微斗数、AI中医助手 | 华夏中医',
    description: '汇聚小六壬占卜、紫微斗数命盘、AI中医助手等传统中医药用工具，传承千年智慧。',
  },
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 relative">
        {/* 主要内容区域 */}
        <div className="sm:ml-[30px] space-y-6">
          {/* 十二时辰对照表 - SSR 友好 */}
          <TimeTable />

          {/* 工具区域 - 客户端交互组件 */}
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-[280px,1fr] gap-6">
              <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-24 mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-12 bg-gray-100 rounded-md" />
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-8 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="h-4 bg-gray-100 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          }>
            <ToolsClient />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
