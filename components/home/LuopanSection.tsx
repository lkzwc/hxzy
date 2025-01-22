'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CompassRing {
  id: string;
  elements: Array<{
    text: string;
    degree: number;
    color: string;
  }>;
  radius: number;
  rotationDirection: 1 | -1;
  tickCount: number;
}

// 五行关系数据
const wuxingData = [
  {
    name: '火',
    color: '#FF5252',
    position: { x: 0, y: -150 },
    properties: ['心', '小肠', '夏', '丙', '房'],
    connections: ['土', '木']
  },
  {
    name: '土',
    color: '#FFC107',
    position: { x: 143, y: -46 },
    properties: ['脾', '胃', '长夏', '戊', '夏'],
    connections: ['金', '火']
  },
  {
    name: '金',
    color: '#FFD700',
    position: { x: 88, y: 121 },
    properties: ['肺', '大肠', '秋', '庚', '肺'],
    connections: ['水', '土']
  },
  {
    name: '水',
    color: '#2196F3',
    position: { x: -88, y: 121 },
    properties: ['肾', '膀胱', '冬', '壬', '膀'],
    connections: ['木', '金']
  },
  {
    name: '木',
    color: '#4CAF50',
    position: { x: -143, y: -46 },
    properties: ['肝', '胆', '春', '甲', '甲'],
    connections: ['火', '水']
  }
];

// 罗盘数据
const compassRings: CompassRing[] = [
  {
    id: 'tiangan',
    elements: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'].map((text, i) => ({
      text,
      degree: i * 36,
      color: '#FF6B6B'
    })),
    radius: 200,
    rotationDirection: 1,
    tickCount: 30
  },
  {
    id: 'dizhi',
    elements: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'].map((text, i) => ({
      text,
      degree: i * 30,
      color: '#4A90E2'
    })),
    radius: 160,
    rotationDirection: -1,
    tickCount: 24
  }
];

export default function LuopanSection() {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [ringRotations, setRingRotations] = useState<Record<string, number>>(
    Object.fromEntries(compassRings.map(ring => [ring.id, 0]))
  );

  // 处理五行元素点击
  const handleWuxingClick = (name: string) => {
    setSelectedElement(selectedElement === name ? null : name);
  };

  // 处理罗盘环旋转
  const handleRingRotation = (ringId: string, delta: number) => {
    setRingRotations(prev => ({
      ...prev,
      [ringId]: prev[ringId] + delta * (compassRings.find(r => r.id === ringId)?.rotationDirection || 1)
    }));
  };

  // 计算属性文字的位置
  const getPropertyPosition = (centerX: number, centerY: number, radius: number, angle: number) => {
    const radian = (angle - 90) * Math.PI / 180;
    return {
      x: centerX + radius * Math.cos(radian),
      y: centerY + radius * Math.sin(radian)
    };
  };

  return (
    <section className="py-20 bg-gradient-to-b from-pink-50 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* 五行图 */}
          <div className="relative">
            <motion.div 
              className="relative w-[500px] h-[500px] mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* 连接线 */}
              <svg className="absolute inset-0 w-full h-full">
                <g transform="translate(250, 250)">
                  {wuxingData.map(element => 
                    element.connections.map(target => {
                      const targetElement = wuxingData.find(e => e.name === target);
                      if (!targetElement) return null;
                      return (
                        <motion.path
                          key={`${element.name}-${target}`}
                          d={`M ${element.position.x} ${element.position.y} 
                             L ${targetElement.position.x} ${targetElement.position.y}`}
                          stroke={element.color}
                          strokeWidth="1"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                        />
                      );
                    })
                  )}
                </g>
              </svg>

              {/* 五行元素 */}
              {wuxingData.map((element, index) => (
                <div
                  key={element.name}
                  className="absolute"
                  style={{
                    left: `${250 + element.position.x}px`,
                    top: `${250 + element.position.y}px`,
                  }}
                >
                  {/* 外圈属性环 */}
                  <div
                    className="absolute w-28 h-28 rounded-full"
                    style={{
                      border: `1px solid ${element.color}`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {/* 属性展示 */}
                    {element.properties.map((prop, i) => {
                      const angle = (i * (360 / element.properties.length)) * (Math.PI / 180);
                      const radius = 52;
                      const x = Math.cos(angle) * radius;
                      const y = Math.sin(angle) * radius;

                      return (
                        <div
                          key={i}
                          className="absolute"
                          style={{
                            left: '50%',
                            top: '50%',
                            transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                            zIndex: 20
                          }}
                        >
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center
                              bg-white shadow-lg"
                            style={{ 
                              border: `1.5px solid ${element.color}`,
                            }}
                          >
                            <span 
                              className="text-xs font-medium"
                              style={{ color: element.color }}
                            >
                              {prop}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 中心五行字 */}
                  <div 
                    className="absolute w-16 h-16 rounded-full 
                      flex items-center justify-center bg-white shadow-lg"
                    style={{ 
                      border: `2px solid ${element.color}`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10
                    }}
                  >
                    <span 
                      className="text-2xl font-bold"
                      style={{ color: element.color }}
                    >
                      {element.name}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* 罗盘 */}
          <div className="relative">
            <motion.div 
              className="relative w-[500px] h-[500px] mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* 罗盘环 */}
              {compassRings.map((ring) => (
                <motion.div
                  key={ring.id}
                  className="absolute top-1/2 left-1/2 w-full h-full"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${ringRotations[ring.id]}deg)`,
                  }}
                >
                  {/* 环形背景 */}
                  <div 
                    className="absolute rounded-full border border-rose-100"
                    style={{
                      inset: `${250 - ring.radius}px`,
                      background: 'linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.5))'
                    }}
                  />

                  {/* 刻度 */}
                  {Array.from({ length: ring.tickCount }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-1/2 left-1/2 origin-bottom"
                      style={{
                        transform: `rotate(${(i * 360) / ring.tickCount}deg)`,
                        height: i % 2 === 0 ? '8px' : '4px',
                        width: '1px',
                        background: 'rgba(0,0,0,0.2)',
                        transformOrigin: `50% ${ring.radius}px`,
                      }}
                    />
                  ))}

                  {/* 文字 */}
                  {ring.elements.map((element, index) => (
                    <motion.div
                      key={index}
                      className="absolute left-1/2 top-1/2"
                      style={{
                        transform: `rotate(${element.degree}deg) translateY(-${ring.radius}px)`,
                      }}
                    >
                      <span 
                        className="inline-block transform -rotate-90"
                        style={{ color: element.color }}
                      >
                        {element.text}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              ))}

              {/* 中心装饰 */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-white 
                  shadow-inner flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-rose-500/10" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 