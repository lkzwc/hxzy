'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// 懒加载特性部分组件
export const LazyFeatureSection = () => {
  const FeaturesSection = dynamic(() => import('@/components/home/FeaturesSection'), {
    loading: () => <div className="h-96 flex items-center justify-center"><div className="w-32 h-32 rounded-lg bg-neutral-100 animate-pulse" /></div>,
    ssr: false
  });
  return <FeaturesSection />;
};

// 懒加载罗盘部分组件
export const LazyLuopanSection = () => {
  const LuopanSection = dynamic(() => import('@/components/home/LuopanSection'), {
    loading: () => <div className="h-96 bg-primary-50 flex items-center justify-center"><div className="w-32 h-32 rounded-full bg-neutral-100 animate-pulse" /></div>,
    ssr: false
  });
  return <LuopanSection />;
};