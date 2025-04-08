'use client';

import Link from 'next/link';
import React from 'react';

interface Tag {
  text: string;
  value: number;
}

interface TagCloudProps {
  tags: Tag[];
  maxTags?: number;
}

const TagCloud = ({ tags, maxTags = 50 }: TagCloudProps) => {
  // 限制标签数量
  const limitedTags = tags.slice(0, maxTags);
  
  // 找出最大权重值
  const maxValue = Math.max(...limitedTags.map(tag => tag.value));
  
  // 根据标签权重计算大小
  const getTagSize = (value: number) => {
    const minSize = 0.7;
    const maxSize = 1.2;
    return minSize + (value / maxValue) * (maxSize - minSize);
  };
  
  // 使用中医传统色彩
  const getTagColor = (value: number) => {
    // 中医传统色彩：墨绿、朱红、藏青、赭石色、青黄、紫檀、丹砂、松花
    const colors = [
      'hsl(150, 40%, 35%)',  // 墨绿
      'hsl(10, 80%, 50%)',    // 朱红
      'hsl(210, 60%, 25%)',   // 藏青
      'hsl(30, 60%, 45%)',    // 赭石色
      'hsl(60, 70%, 50%)',    // 青黄
      'hsl(340, 50%, 40%)',   // 紫檀
      'hsl(0, 70%, 55%)',     // 丹砂
      'hsl(90, 45%, 45%)'     // 松花
    ];
    
    // 根据权重选择颜色
    const colorIndex = Math.floor((value / maxValue) * (colors.length - 1));
    return colors[colorIndex];
  };

  return (
    <div className="w-full h-64 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden relative hover:shadow-md transition-all duration-300">
      <div className="tag-cloud-container">
        <div className="tag-cloud">
          {limitedTags.map((tag, index) => {
            const size = getTagSize(tag.value);
            const color = getTagColor(tag.value);
            
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
              fontWeight: tag.value > (maxValue * 0.7) ? 'bold' : 'normal',
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
          perspective: 800px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(250,250,250,0.7));
          padding: 1rem;
        }
        
        .tag-cloud {
          position: relative;
          width: 280px;
          height: 280px;
          transform-style: preserve-3d;
          animation: rotate 30s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .tag-item {
          position: absolute;
          top: 50%;
          left: 50%;
          transform-origin: center;
          white-space: nowrap;
          user-select: none;
          transform-style: preserve-3d;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .tag-item:hover {
          z-index: 1000 !important;
          transform: scale(1.2) !important;
          text-shadow: 0 3px 12px rgba(0,0,0,0.15) !important;
          filter: brightness(1.1);
        }
        
        @keyframes rotate {
          0% {
            transform: rotateX(8deg) rotateY(0deg);
          }
          50% {
            transform: rotateX(-8deg) rotateY(180deg);
          }
          100% {
            transform: rotateX(8deg) rotateY(360deg);
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