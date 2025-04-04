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
  
  // 使用中医传统色彩
  const getTagColor = (value: number, max: number) => {
    // 中医传统色彩：墨绿、朱红、藏青、赭石色、青黄
    const colors = [
      'hsl(150, 40%, 35%)', // 墨绿
      'hsl(10, 80%, 50%)',  // 朱红
      'hsl(210, 60%, 25%)', // 藏青
      'hsl(30, 60%, 45%)',  // 赭石色
      'hsl(60, 70%, 50%)'   // 青黄
    ];
    
    // 根据权重选择颜色
    const colorIndex = Math.floor((value / max) * (colors.length - 1));
    return colors[colorIndex];
  };

  return (
    <div className="w-full h-64 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden relative hover:shadow-md transition-all duration-300">
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
              textShadow: '0 1px 3px rgba(0,0,0,0.15)',
              cursor: 'pointer',
              transition: 'transform 0.3s ease-out, color 0.3s ease',
              fontWeight: value > (maxValue * 0.7) ? 'bold' : 'normal',
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
          perspective: 600px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(250,250,250,0.5));
        }
        
        .tag-cloud {
          position: relative;
          width: 240px;
          height: 240px;
          transform-style: preserve-3d;
          animation: rotate 25s infinite linear;
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
          transform: scale(1.3) !important;
          text-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
        }
        
        @keyframes rotate {
          0% {
            transform: rotateX(5deg) rotateY(0deg);
          }
          50% {
            transform: rotateX(-5deg) rotateY(180deg);
          }
          100% {
            transform: rotateX(5deg) rotateY(360deg);
          }
        }
        
        /* 暂停动画当鼠标悬停 */
        .tag-cloud-container:hover .tag-cloud {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default TagCloud;