import { Suspense } from 'react';
import type { Metadata } from 'next';
import DatabaseClient from './DatabaseClient';

export const metadata: Metadata = {
  title: '中医数据库 - 中药、经方、课程、电子书',
  description: '华夏中医数据库，收录中药、经典方剂、中医课程和电子书资源，探索传统中医药的智慧宝库。涵盖人参、当归、六味地黄丸、四君子汤等经典中药与方剂。',
  keywords: ['中药数据库', '经方', '中医课程', '中医电子书', '黄帝内经', '伤寒论', '六味地黄丸', '四君子汤', '人参', '当归'],
  openGraph: {
    title: '中医数据库 - 中药、经方、课程、电子书 | 华夏中医',
    description: '收录中药、经典方剂、中医课程和电子书资源，探索传统中医药的智慧宝库。',
  },
};

export default function ZhongYiDBPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* 头部 Banner - SSR */}  
      <div className="bg-gradient-to-b from-primary to-primary-focus text-primary-content pt-12 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">中医数据库</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              探索传统中医药的智慧宝库，包含中药、经方、课程和电子书等丰富资源
            </p>
          </div>
        </div>
      </div>

      {/* 搜索 + Tab + 内容 - 客户端交互，搜索栏通过负边距重叠 banner */}
      <Suspense fallback={
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto -mt-8 mb-12">
            <div className="h-14 bg-white rounded-full shadow-lg animate-pulse" />
          </div>
          <div className="flex justify-center mb-12">
            <div className="h-12 bg-gray-100 rounded-full w-96 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="card bg-base-100 shadow p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-24 mb-4" />
                <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      }>
        <DatabaseClient />
      </Suspense>
    </div>
  );
}
