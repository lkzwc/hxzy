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
      <h3 className="text-lg font-medium text-gray-900 mb-2">热门标签</h3>
      <TagCloud tags={data.tags} maxTags={50} />
    </div>
  );
};

export default TagCloudContainer;