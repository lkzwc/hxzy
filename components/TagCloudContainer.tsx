'use client';

import { useState, useEffect } from 'react';
import TagCloud from './TagCloud';
import useSWR from 'swr';

interface Tag {
  text: string;
  value: number;
}

interface TagsResponse {
  tags: Tag[];
  topTags: string[];
}

// 定义获取标签的fetcher函数
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('获取标签数据失败');
  }
  return res.json();
};

const TagCloudContainer = () => {
  // 使用SWR获取标签数据
  const { data, error, isLoading } = useSWR<TagsResponse>('/api/tags', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  if (isLoading) {
    return (
      <div className="w-full h-64 bg-white rounded-lg shadow-sm border border-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full h-64 bg-white rounded-lg shadow-sm border border-gray-100 flex justify-center items-center text-gray-500">
        无法加载标签云
      </div>
    );
  }

  return (
    <div className="mt-3">
      <h3 className="text-base font-medium text-gray-900 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
        <span className="w-1 h-4 bg-primary rounded-full"></span>
        热门标签
      </h3>
      <TagCloud tags={data.tags} maxTags={50} />
      
      {/* 热门标签列表 */}
      {data.topTags && data.topTags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {data.topTags.slice(0, 10).map((tag) => (
            <a
              key={tag}
              href={`/community?tag=${encodeURIComponent(tag)}`}
              className="px-2.5 py-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full transition-colors border border-gray-100 hover:border-gray-200"
            >
              {tag}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagCloudContainer;