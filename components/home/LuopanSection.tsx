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
    properties: ['南方', '夏季', '心脏', '丙丁', '赤色'],
    connections: ['土', '木']
  },
  {
    name: '土',
    color: '#FFC107',
    position: { x: 143, y: -46 },
    properties: ['中央', '长夏', '脾胃', '戊己', '黄色'],
    connections: ['金', '火']
  },
  {
    name: '金',
    color: '#FFD700',
    position: { x: 88, y: 121 },
    properties: ['西方', '秋季', '肺部', '庚辛', '白色'],
    connections: ['水', '土']
  },
  {
    name: '水',
    color: '#2196F3',
    position: { x: -88, y: 121 },
    properties: ['北方', '冬季', '肾脏', '壬癸', '黑色'],
    connections: ['木', '金']
  },
  {
    name: '木',
    color: '#4CAF50',
    position: { x: -143, y: -46 },
    properties: ['东方', '春季', '肝脏', '甲乙', '青色'],
    connections: ['火', '水']
  }
];

// 罗盘数据
const compassRings: CompassRing[] = [
  {
    id: 'jieqi',
    elements: [
      '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
      '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
      '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
      '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'
    ].map((text, i) => ({
      text,
      degree: (i * 15) - 90,  // 从正北开始
      color: '#4A5568'
    })),
    radius: 220,
    rotationDirection: -1,
    tickCount: 24
  },
  {
    id: 'dizhi',
    elements: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'].map((text, i) => ({
      text,
      degree: (i * 30) - 90,  // 从正北开始
      color: '#4A90E2'
    })),
    radius: 180,
    rotationDirection: 1,
    tickCount: 12
  },
  {
    id: 'shichen',
    elements: [
      '子时', '丑时', '寅时', '卯时', '辰时', '巳时',
      '午时', '未时', '申时', '酉时', '戌时', '亥时'
    ].map((text, i) => ({
      text,
      degree: (i * 30) - 90,  // 从正北开始
      color: '#805AD5'
    })),
    radius: 140,
    rotationDirection: -1,
    tickCount: 12
  },
  {
    id: 'bagua',
    elements: ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤'].map((text, i) => ({
      text,
      degree: (i * 45) - 90,  // 从正北开始
      color: '#2D3748'
    })),
    radius: 100,
    rotationDirection: 1,
    tickCount: 8
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
                    className="absolute w-36 h-36 rounded-full"
                    style={{
                      border: `1px solid ${element.color}`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {/* 属性展示 */}
                    {element.properties.map((prop, i) => {
                      const angle = (i * (360 / element.properties.length)) * (Math.PI / 180);
                      const radius = 65;
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
                            className="w-8 h-8 rounded-full flex items-center justify-center
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
                    className="absolute w-20 h-20 rounded-full 
                      flex items-center justify-center bg-white shadow-lg"
                    style={{ 
                      border: `2px solid ${element.color}`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10
                    }}
                  >
                    <span 
                      className="text-3xl font-bold"
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
              {/* 中心太极图 */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-white shadow-lg">
                  {/* 太极背景 */}
                  <div className="absolute inset-0 bg-black" />
                  {/* 阴阳分割 */}
                  <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-white rounded-t-full" />
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-black rounded-b-full" />
                    {/* 阴阳鱼 */}
                    <div className="absolute -translate-x-1/2 w-12 h-12">
                      <div className="w-full h-full rounded-full bg-black">
                        <div className="absolute  -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white" />
                      </div>
                    </div>
                    <div className="absolute -translate-x-1/2 w-12 h-12">
                      <div className="w-full h-full rounded-full bg-white">
                        <div className="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-black" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 罗盘环 */}
              {compassRings.map((ring) => (
                <motion.div
                  key={ring.id}
                  className="absolute  w-full h-full"
                  animate={{ 
                    rotate: ring.rotationDirection === 1 ? 360 : -360 
                  }}
                  transition={{
                    duration: 60 + ring.radius / 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    transform: `translate(-50%, -50%)`,
                  }}
                >
                  {/* 环形背景 */}
                  <div 
                    className="absolute rounded-full border border-gray-200"
                    style={{
                      width: ring.radius * 2,
                      height: ring.radius * 2,
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: 'linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.5))'
                    }}
                  />

                  {/* 文字 */}
                  {ring.elements.map((element, index) => {
                    const angle = (element.degree * Math.PI) / 180;
                    const x = Math.cos(angle) * ring.radius;
                    const y = Math.sin(angle) * ring.radius;
                    
                    return (
                      <div
                        key={index}
                        className="absolute"
                        style={{
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        <span 
                          className="inline-block text-sm font-medium"
                          style={{ 
                            color: element.color,
                            transform: `rotate(${-element.degree}deg)`,
                            width: ring.id === 'jieqi' ? '32px' : '24px',
                            textAlign: "center",
                            whiteSpace: "nowrap"
                          }}
                        >
                          {element.text}
                        </span>
                      </div>
                    );
                  })}
                </motion.div>
              ))}

              {/* 中心太极图 - 保持不动 */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 z-10">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-white shadow-lg">
                  {/* 太极背景 */}
                  <div className="absolute inset-0 bg-black" />
                  {/* 阴阳分割 */}
                  <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-white rounded-t-full" />
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-black rounded-b-full" />
                    {/* 阴阳鱼 */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-12 h-12">
                      <div className="w-full h-full rounded-full bg-black">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-12 h-12">
                      <div className="w-full h-full rounded-full bg-white">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-black" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 