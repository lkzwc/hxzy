'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Tag {
  text: string;
  value: number;
}

interface TagCloudProps {
  tags: Tag[];
  maxTags?: number;
}

// 主词云组件
const TagCloud = ({ tags, maxTags = 50 }: TagCloudProps) => {
  // 限制标签数量，避免性能问题
  const limitedTags = tags.slice(0, maxTags);
  
  // 找出最大权重值
  const maxValue = Math.max(...limitedTags.map(tag => tag.value));
  
  // 根据标签权重计算大小和颜色
  const getTagSize = (value: number, max: number) => {
    const minSize = 0.8;
    const maxSize = 1.6;
    return minSize + (value / max) * (maxSize - minSize);
  };
  
  const getTagColor = (value: number, max: number) => {
    const intensity = Math.min(0.5 + (value / max) * 0.5, 1);
    return `hsl(${220 + (value / max) * 40}, ${70 + (value / max) * 30}%, ${50 + (value / max) * 20}%)`;
  };

  return (
    <div className="w-full h-64 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden relative">
      <div className="tag-cloud-container">
        <div className="tag-cloud">
          {limitedTags.map((tag, index) => {
            const size = getTagSize(tag.value, maxValue);
            const color = getTagColor(tag.value, maxValue);
            
            // 计算标签在球面上的位置
            const phi = Math.acos(-1 + (2 * index) / limitedTags.length);
            const theta = Math.sqrt(limitedTags.length * Math.PI) * phi;
            
            // 球体半径
            const radius = 120;
            
            // 计算3D坐标
            const x = radius * Math.cos(theta) * Math.sin(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(phi);
            
            // 计算标签样式
            const style = {
              fontSize: `${size}rem`,
              color: color,
              position: 'absolute',
              transform: `translate3d(${x}px, ${y}px, ${z}px)`,
              opacity: (z + radius) / (2 * radius), // 根据z轴位置调整透明度
              zIndex: Math.floor((z + radius) / 2), // 根据z轴位置调整层级
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.1s ease-out',
            } as React.CSSProperties;
            
            return (
              <Link 
                href={`/community?tag=${encodeURIComponent(tag.text)}`}
                key={tag.text} 
                className="tag-item"
                style={style}
              >
                {tag.text}
              </Link>
            );
          })}
        </div>
      </div>
      
      <style jsx>{`
        .tag-cloud-container {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          perspective: 500px;
        }
        
        .tag-cloud {
          position: relative;
          width: 240px;
          height: 240px;
          transform-style: preserve-3d;
          animation: rotate 20s infinite linear;
        }
        
        .tag-item {
          position: absolute;
          top: 50%;
          left: 50%;
          transform-origin: center;
          white-space: nowrap;
          user-select: none;
          transform-style: preserve-3d;
        }
        
        .tag-item:hover {
          z-index: 1000 !important;
          transform: scale(1.2) !important;
        }
        
        @keyframes rotate {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default TagCloud;