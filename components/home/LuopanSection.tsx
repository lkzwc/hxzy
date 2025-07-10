'use client';

import { useState, useEffect, useRef, memo } from 'react';
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
    color: '#DC2626', // 更具传统的朱红色
    position: { x: 0, y: -150 },
    properties: ['南方', '夏季', '心脏', '丙丁', '赤色'],
    connections: ['土'] // 火生土
  },
  {
    name: '土',
    color: '#B45309', // 更沉稳的赭石色
    position: { x: 143, y: -46 },
    properties: ['中央', '长夏', '脾胃', '戊己', '黄色'],
    connections: ['金'] // 土生金
  },
  {
    name: '金',
    color: '#92400E', // 更古朴的铜金色
    position: { x: 88, y: 121 },
    properties: ['西方', '秋季', '肺部', '庚辛', '白色'],
    connections: ['水'] // 金生水
  },
  {
    name: '水',
    color: '#1E40AF', // 更深邃的靛青色
    position: { x: -88, y: 121 },
    properties: ['北方', '冬季', '肾脏', '壬癸', '黑色'],
    connections: ['木'] // 水生木
  },
  {
    name: '木',
    color: '#166534', // 更沉稳的松柏绿
    position: { x: -143, y: -46 },
    properties: ['东方', '春季', '肝脏', '甲乙', '青色'],
    connections: ['火'] // 木生火
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
      color: '#6D28D9' // 更深沉的紫色，代表节气的庄重感
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
      color: '#1D4ED8' // 更沉稳的藏青色，代表地支的稳重
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
      color: '#831843' // 更深沉的酱紫色，代表时辰的庄重
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
      color: '#064E3B' // 更深邃的墨绿色，代表八卦的自然与和谐
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
  const [isMobile, setIsMobile] = useState(false);
  
  // 使用useRef跟踪组件是否已挂载，减少初始渲染的工作量
  const isMounted = useRef(false);
  
  // 检测屏幕尺寸 - 优化事件监听
  useEffect(() => {
    // 标记组件已挂载
    isMounted.current = true;
    
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    
    // 使用防抖函数优化resize事件
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkMobile, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
      isMounted.current = false;
    };
  }, []);

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
      x: Math.round(centerX + radius * Math.cos(radian)),
      y: Math.round(centerY + radius * Math.sin(radian))
    };
  };

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-amber-50/90 via-white to-stone-100/90 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* 五行图 */}
          <div className="relative">
            <motion.div 
              className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px] mx-auto"
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ 
                opacity: 1,
                rotate: 360 
              }}
              transition={{ 
                opacity: { duration: 0.8 },
                rotate: {
                  duration: 60,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}
            >
              {/* 连接线 */}
              <svg className="absolute inset-0 w-full h-full">
                <g transform={`translate(${isMobile ? 150 : 300}, ${isMobile ? 150 : 300}) scale(${isMobile ? 0.6 : 1.2})`}>
                  {/* 相生关系线 - 实线 */}
                  {wuxingData.map((element) => 
                    element.connections.map(target => {
                      const targetElement = wuxingData.find(e => e.name === target);
                      if (!targetElement) return null;
                      
                      return (
                        <motion.path
                          key={`${element.name}-${target}`}
                          d={`M ${element.position.x} ${element.position.y} 
                             L ${targetElement.position.x} ${targetElement.position.y}`}
                          stroke={element.color}
                          strokeWidth="2"
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
              {wuxingData.map((element, index) => {
                const centerOffset = isMobile ? 150 : 300;
                const scale = isMobile ? 0.6 : 1.2;
                
                return (
                  <motion.div
                    key={element.name}
                    className="absolute"
                    style={{
                      left: `${centerOffset + element.position.x * scale}px`,
                      top: `${centerOffset + element.position.y * scale}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    animate={{ 
                      rotate: -360 
                    }}
                    transition={{
                      duration: 60,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    {/* 外圈属性环 */}
                    <div
                      className="absolute w-24 h-24 md:w-40 md:h-40 rounded-full"
                      style={{
                        border: `1px solid ${element.color}`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      {/* 属性展示 */}
                      {element.properties.map((prop, i) => {
                        const angle = (i * (360 / element.properties.length));
                        const radius = isMobile ? 45 : 75;
                        const x = Math.cos(angle * Math.PI / 180) * radius;
                        const y = Math.sin(angle * Math.PI / 180) * radius;

                        return (
                          <div
                            key={i}
                            className="absolute z-20"
                            style={{
                              left: '50%',
                              top: '50%',
                              transform: `translate(-50%, -50%) translate(${Math.round(x)}px, ${Math.round(y)}px)`
                            }}
                          >
                            <div 
                              className="w-6 h-6 md:w-10 md:h-10 rounded-full flex items-center justify-center
                                bg-white shadow-lg"
                              style={{ 
                                border: `1.5px solid ${element.color}`,
                              }}
                            >
                              <span 
                                className="text-[10px] md:text-sm font-medium"
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
                      className="absolute w-14 h-14 md:w-24 md:h-24 rounded-full 
                        flex items-center justify-center bg-white shadow-lg"
                      style={{ 
                        border: `2px solid ${element.color}`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10
                      }}
                    >
                      <span 
                        className="text-2xl md:text-4xl font-bold"
                        style={{ color: element.color }}
                      >
                        {element.name}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* 罗盘 */}
          <div className="relative mt-8 lg:mt-0">
            <motion.div 
              className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* 罗盘环 */}
              {compassRings.map((ring) => (
                <motion.div
                  key={ring.id}
                  className="absolute w-full h-full"
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
                    className="absolute rounded-full border border-amber-200 shadow-inner"
                    style={{
                      width: isMobile ? ring.radius * 1.2 : ring.radius * 2,
                      height: isMobile ? ring.radius * 1.2 : ring.radius * 2,
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: 'linear-gradient(to right, rgba(255,247,237,0.95), rgba(254,243,199,0.6))'
                    }}
                  />

                  {/* 文字 */}
                  {ring.elements.map((element, index) => {
                    const angle = (element.degree * Math.PI) / 180;
                    const radius = isMobile ? ring.radius * 0.6 : ring.radius;
                    const x = Number((Math.cos(angle) * radius).toFixed());
                    const y = Number((Math.sin(angle) * radius).toFixed());
                    
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
                          className="inline-block text-xs md:text-sm font-medium"
                          style={{ 
                            color: element.color,
                            transform: `rotate(${-element.degree}deg)`,
                            width: ring.id === 'jieqi' ? '24px' : '20px',
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

              {/* 中心八卦太极图 */}
              <motion.div 
                className="absolute top-[37%] left-[37%] -translate-x-1/2 -translate-y-1/2 
                  w-20 h-20 md:w-32 md:h-32 z-10"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 60,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div className="relative w-full h-full rounded-full overflow-hidden bg-white shadow-lg border border-amber-200">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* 背景圆 */}
                    <circle cx="100" cy="100" r="98" fill="white" stroke="#FDE68A" strokeWidth="1" />
                    
                    {/* 八卦符号 - 围绕太极图，按照传统方位排列 */}
                    {/* 乾卦 (天) - 正北方 - 三阳爻 */}
                    <g transform="translate(100, 20)">
                      <line x1="-12" y1="-5" x2="12" y2="-5" stroke="#064E3B" strokeWidth="2" />
                      <line x1="-12" y1="0" x2="12" y2="0" stroke="#064E3B" strokeWidth="2" />
                      <line x1="-12" y1="5" x2="12" y2="5" stroke="#064E3B" strokeWidth="2" />
                    </g>
                    
                    {/* 兑卦 (泽) - 东北方 - 上下阳爻，中间阴爻 */}
                    <g transform="translate(155, 45)">
                      <line x1="-12" y1="-5" x2="12" y2="-5" stroke="#064E3B" strokeWidth="2" />
                      <line x1="-12" y1="0" x2="-2" y2="0" stroke="#064E3B" strokeWidth="2" />
                      <line x1="2" y1="0" x2="12" y2="0" stroke="#064E3B" strokeWidth="2" />
                      <line x1="-12" y1="5" x2="12" y2="5" stroke="#064E3B" strokeWidth="2" />
                    </g>
                    
                    {/* 离卦 (火) - 正东方 - 上下阳爻，中间阴爻 */}
                    <g transform="translate(180, 100)">
                      <line x1="-12" y1="-5" x2="12" y2="-5" stroke="#064E3B" strokeWidth="2" />
                      <line x1="-12" y1="0" x2="-2" y2="0" stroke="#064E3B" strokeWidth="2" />
                      <line x1="2" y1="0" x2="12" y2="0" stroke="#064E3B" strokeWidth="2" />
                      <line x1="-12" y1="5" x2="12" y2="5" stroke="#064E3B" strokeWidth="2" />
                    </g>
                    
                    {/* 震卦 (雷) - 东南方 - 下阳爻，上中阴爻 */}
                    <g transform="translate(155, 155)">
                      <line x1="-12" y1="-5" x2="-2" y2="-5" stroke="#064E3B" strokeWidth="2" />
                      <line x1="2" y1="-5" x2="12" y2="-5" stroke="#064E3B" strokeWidth="2" />
                      <line x1="-12" y1="0" x2="-2" y2="0" stroke="#064E3B" strokeWidth="2" />
                      <line x1="2" y1="0" x2="12" y2="0" stroke="#064E3B" strokeWidth="2" />
                      <line x1="-12" y1="5" x2="12" y2="5" stroke="#064E3B" strokeWidth="2" />
                    </g>
                    
                    {/* 巽卦 (风) - 正南方 - 上中阳爻，下阴爻 */}
                    <g transform="translate(100, 180)">
                      <line x1="-12" y1="-5" x2="12" y2="-5" stroke="#064E3B" strokeWidth="2" />
                      <line x1="-12" y1="0" x2="12" y2="0" stroke="#064E3B" strokeWidth="2" />
                      <line x1="-12" y1="5" x2="-2" y2="5" stroke="#064E3B" strokeWidth="2" />
                      <line x1="2" y1="5" x2="12" y2="5" stroke="#064E3B" strokeWidth="2" />
                    </g>
                    
                    {/* 坎卦 (水) - 西南方 - 中阳爻，上下阴爻 */}
                    <g transform="translate(45, 155)">
                      <line x1="-12" y1="-5" x2="-2" y2="-5" stroke="#064E3B" strokeWidth="2" />
                      <line x1="2" y1="-5" x2="12" y2="-5" stroke="#064E3B" strokeWidth="2" />
                      <line x1="-12" y1="0" x2="12" y2="0" stroke="#064E3B" strokeWidth="2" />
                      <line x1="-12" y1="5" x2="-2" y2="5" stroke="#064E3B" strokeWidth="2" />
                      <line x1="2" y1="5" x2="12" y2="5" stroke="#064E3B" strokeWidth="2" />
                    </g>
                    
                    {/* 艮卦 (山) - 正西方 - 上阳爻，中下阴爻 */}
                    <g transform="translate(20, 100)">
                      <line x1="-12" y1="-5" x2="12" y2="-5" stroke="#064E3B" strokeWidth="2" />
                      <line x1="-12" y1="0" x2="-2" y2="0" stroke="#064E3B" strokeWidth="2" />
                      <line x1="2" y1="0" x2="12" y2="0" stroke="#064E3B" strokeWidth="2" />
                      <line x1="-12" y1="5" x2="-2" y2="5" stroke="#064E3B" strokeWidth="2" />
                      <line x1="2" y1="5" x2="12" y2="5" stroke="#064E3B" strokeWidth="2" />
                    </g>
                    
                    {/* 坤卦 (地) - 西北方 - 三阴爻 */}
                    <g transform="translate(45, 45)">
                      <line x1="-12" y1="-5" x2="-2" y2="-5" stroke="#064E3B" strokeWidth="2" />
                      <line x1="2" y1="-5" x2="12" y2="-5" stroke="#064E3B" strokeWidth="2" />
                      <line x1="-12" y1="0" x2="-2" y2="0" stroke="#064E3B" strokeWidth="2" />
                      <line x1="2" y1="0" x2="12" y2="0" stroke="#064E3B" strokeWidth="2" />
                      <line x1="-12" y1="5" x2="-2" y2="5" stroke="#064E3B" strokeWidth="2" />
                      <line x1="2" y1="5" x2="12" y2="5" stroke="#064E3B" strokeWidth="2" />
                    </g>
                    
                    {/* 中心太极图 */}
                    <g transform="translate(100, 100) scale(0.5)">
                      <circle cx="0" cy="0" r="50" fill="white" stroke="#FDE68A" strokeWidth="1" />
                      
                      {/* 阴阳分割线 */}
                      <path
                        d="M0,-50 A50,50 0 0,1 0,50 A25,25 0 0,0 0,0 A25,25 0 0,1 0,-50"
                        fill="black"
                      />
                      <path
                        d="M0,-50 A50,50 0 0,0 0,50 A25,25 0 0,1 0,0 A25,25 0 0,0 0,-50"
                        fill="white"
                      />
                      
                      {/* 阴阳鱼眼 */}
                      <circle cx="0" cy="-25" r="5" fill="white" />
                      <circle cx="0" cy="-25" r="1.5" fill="black" />
                      <circle cx="0" cy="25" r="5" fill="black" />
                      <circle cx="0" cy="25" r="1.5" fill="white" />
                    </g>
                  </svg>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}