'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Like, Comment, Book, Prescription, Stethoscope, Leaves, Right } from '@icon-park/react'

export default function Home() {
  const { data: session } = useSession()
  const [activeFeature, setActiveFeature] = useState(0)

  // 自动切换特色内容
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const features = [
    {
      title: '传统医学智慧',
      desc: '探索中医理论体系，传承千年医药智慧',
      image: '/images/feature-1.jpg',
      stats: [
        { label: '历史传承', value: '5000+', unit: '年' },
        { label: '经典著作', value: '300+', unit: '部' },
        { label: '验方记载', value: '10万+', unit: '个' },
      ]
    },
    {
      title: '现代科研创新',
      desc: '融合现代科技，创新发展中医药',
      image: '/images/feature-2.jpg',
      stats: [
        { label: '研究项目', value: '1000+', unit: '个' },
        { label: '科研成果', value: '500+', unit: '项' },
        { label: '专利技术', value: '2000+', unit: '项' },
      ]
    },
    {
      title: '健康生活方式',
      desc: '倡导养生保健，共享健康人生',
      image: '/images/feature-3.jpg',
      stats: [
        { label: '养生方法', value: '800+', unit: '种' },
        { label: '中药材', value: '6000+', unit: '味' },
        { label: '养生食谱', value: '3000+', unit: '例' },
      ]
    }
  ]

  return (
    <main className="min-h-screen bg-[#FAF6F1]">
      {/* Section 1: 顶部横幅 */}
      <div className="relative min-h-[600px] lg:min-h-[800px] bg-gradient-to-b from-[#F5EDE4] to-[#FAF6F1] overflow-hidden">
        {/* 装饰图案 */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-48 lg:w-96 h-48 lg:h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-48 lg:w-96 h-48 lg:h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute inset-0 bg-[url('/images/bg-pattern.png')] opacity-5" />
        </div>

        <div className="container mx-auto px-4 h-full">
          <div className="relative grid lg:grid-cols-12 gap-8 lg:gap-16 items-center py-16 lg:py-32">
            {/* 左侧内容 */}
            <div className="lg:col-span-5 lg:pl-8 text-center lg:text-left">
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6 lg:mb-8">
                中医药文化传承与创新平台
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-text mb-6 lg:mb-8 leading-tight">
                传承千年智慧，
                <br />
                守护<span className="text-primary">现代健康</span>
              </h1>
              <p className="text-lg lg:text-xl text-text/70 mb-8 lg:mb-12 leading-relaxed">
                探索中医药文化瑰宝，分享养生保健心得，
                <br className="hidden lg:block" />
                共同传承和发展中华民族的传统医药文化
              </p>
              <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center lg:justify-start">
                <Link 
                  href="/community" 
                  className="btn btn-primary gap-2 lg:btn-lg lg:min-w-[180px] lg:h-16 text-base lg:text-lg"
                >
                  进入社区
                  <Right theme="outline" size="20" className="hidden sm:block" />
                </Link>
                <Link 
                  href="/about" 
                  className="btn btn-outline lg:btn-lg lg:h-16 text-base lg:text-lg hover:bg-white/50"
                >
                  了解更多
                </Link>
              </div>
            </div>

            {/* 右侧特色内容 */}
            <div className="lg:col-span-7 relative mt-12 lg:mt-0">
              <div className="aspect-[4/3] relative">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 ${
                      index === activeFeature
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                    }`}
                  >
                    <div className="relative h-full rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
                        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 lg:mb-4">{feature.title}</h3>
                        <p className="text-base lg:text-xl text-white/90 mb-4 lg:mb-8">{feature.desc}</p>
                        <div className="grid grid-cols-3 gap-4 lg:gap-8">
                          {feature.stats.map((stat, i) => (
                            <div key={i} className="text-center">
                              <div className="text-2xl lg:text-4xl font-bold text-white mb-1 lg:mb-2">{stat.value}</div>
                              <div className="text-sm lg:text-base text-white/80">{stat.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* 切换指示器 */}
              <div className="absolute -bottom-8 lg:-bottom-12 left-1/2 -translate-x-1/2 flex gap-2 lg:gap-3">
                {features.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 lg:w-3 h-2 lg:h-3 rounded-full transition-all duration-300 ${
                      index === activeFeature
                        ? 'w-8 lg:w-12 bg-primary'
                        : 'bg-primary/20 hover:bg-primary/40'
                    }`}
                    onClick={() => setActiveFeature(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: 五行罗盘部分 */}
      <div className="relative min-h-screen bg-gradient-to-b from-[#F5EDE4] via-[#FAF6F1] to-[#F5EDE4] overflow-hidden">
        {/* 星云背景效果 */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-mystic-200/10 to-transparent animate-pulse-slow" />
          <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.08] mix-blend-overlay" />
          <div className="absolute inset-0">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute animate-glow"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 3}px`,
                  height: `${Math.random() * 3}px`,
                  backgroundColor: '#D4B886',
                  borderRadius: '50%',
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 py-24 lg:py-32 relative">
          <div className="text-center mb-24">
            <div className="inline-block px-6 py-3 bg-mystic-200/20 backdrop-blur-sm rounded-full text-mystic-900 text-sm font-medium mb-6 shadow-neon animate-float">
              中医文化精髓
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-mystic-900 mb-6 drop-shadow-neon">
              五行八卦 · 天人合一
            </h2>
            <p className="text-xl text-mystic-800/90 max-w-2xl mx-auto leading-relaxed">
              探索中医文化的核心智慧，感受传统哲学的深邃魅力
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 max-w-7xl mx-auto">
            {/* 五行图 */}
            <div className="relative aspect-square">
              <div className="absolute inset-0 animate-morph bg-gradient-to-br from-mystic-200/10 to-mystic-200/5 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] backdrop-blur-sm" />
              <div className="relative w-full h-full transform-gpu hover:scale-105 transition-transform duration-1000">
                <div className="absolute inset-0 transform hover:rotate-30 transition-transform duration-1000">
                  <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-neon-strong">
                    <defs>
                      <radialGradient id="elementGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#D4B886" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#D4B886" stopOpacity="0" />
                      </radialGradient>
                      <filter id="elementNeonGlow">
                        <feFlood floodColor="#D4B886" floodOpacity="1" />
                        <feComposite in2="SourceAlpha" operator="in" />
                        <feGaussianBlur stdDeviation="2" />
                        <feComponentTransfer>
                          <feFuncA type="linear" slope="3" intercept="0" />
                        </feComponentTransfer>
                        <feBlend in="SourceGraphic" />
                      </filter>
                      <linearGradient id="elementLine" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#D4B886" stopOpacity="0.2" />
                        <stop offset="50%" stopColor="#D4B886" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#D4B886" stopOpacity="0.2" />
                      </linearGradient>
                    </defs>

                    {/* 五行底层光效 */}
                    <g className="animate-pulse-slow">
                      <path
                        d="M50 10 L85 35 L75 80 L25 80 L15 35 Z"
                        fill="url(#elementGlow)"
                        className="opacity-40"
                      />
                    </g>

                    {/* 动态连线 */}
                    {[
                      'M50 10 Q67.5 22.5 85 35',
                      'M85 35 Q80 57.5 75 80',
                      'M75 80 Q50 80 25 80',
                      'M25 80 Q20 57.5 15 35',
                      'M15 35 Q32.5 22.5 50 10'
                    ].map((d, i) => (
                      <g key={i} className="animate-dash">
                        <path
                          d={d}
                          fill="none"
                          stroke="url(#elementLine)"
                          strokeWidth="0.8"
                          strokeDasharray="4,4"
                          className="opacity-80"
                        >
                          <animate
                            attributeName="stroke-dashoffset"
                            values="8;0"
                            dur="4s"
                            repeatCount="indefinite"
                          />
                        </path>
                      </g>
                    ))}

                    {/* 五行元素节点 */}
                    {[
                      { x: 50, y: 10, text: '木', color: '#4B7355', rotation: 0 },
                      { x: 85, y: 35, text: '火', color: '#C1432E', rotation: 72 },
                      { x: 75, y: 80, text: '土', color: '#B88C3D', rotation: 144 },
                      { x: 25, y: 80, text: '金', color: '#E1D4BB', rotation: 216 },
                      { x: 15, y: 35, text: '水', color: '#2F4F60', rotation: 288 }
                    ].map((item, index) => (
                      <g key={index} filter="url(#elementNeonGlow)" className="animate-pulse-slow">
                        {/* 发光环 */}
                        <circle
                          cx={item.x}
                          cy={item.y}
                          r="12"
                          fill="none"
                          stroke={item.color}
                          strokeWidth="0.8"
                          className="opacity-40"
                        >
                          <animate
                            attributeName="r"
                            values="8;12;8"
                            dur="3s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        {/* 核心圆点 */}
                        <circle
                          cx={item.x}
                          cy={item.y}
                          r="6"
                          fill={item.color}
                          className="opacity-90"
                        >
                          <animate
                            attributeName="opacity"
                            values="0.9;0.6;0.9"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        {/* 文字 */}
                        <text
                          x={item.x}
                          y={item.y}
                          dy="1"
                          fontSize="4"
                          fill={item.color}
                          textAnchor="middle"
                          alignmentBaseline="middle"
                          className="font-bold drop-shadow-neon"
                          transform={`rotate(${item.rotation} ${item.x} ${item.y})`}
                        >
                          {item.text}
                        </text>
                        {/* 能量波纹 */}
                        <circle
                          cx={item.x}
                          cy={item.y}
                          r="4"
                          fill="none"
                          stroke={item.color}
                          strokeWidth="0.8"
                          className="opacity-0"
                        >
                          <animate
                            attributeName="r"
                            values="4;20"
                            dur="3s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.6;0"
                            dur="3s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      </g>
                    ))}

                    {/* 相生箭头 - 动态光效 */}
                    <g className="animate-flow">
                      {[
                        'M52 14 Q 70 20 82 32',
                        'M82 38 Q 80 60 72 77',
                        'M71 80 Q 50 82 28 80',
                        'M22 77 Q 15 60 17 38',
                        'M18 32 Q 30 20 48 14'
                      ].map((d, i) => (
                        <path
                          key={i}
                          d={d}
                          fill="none"
                          stroke="#D4B886"
                          strokeWidth="1"
                          strokeDasharray="2,4"
                          className="opacity-90"
                          markerEnd="url(#glowArrow)"
                        >
                          <animate
                            attributeName="stroke-dashoffset"
                            values="6;0"
                            dur="4s"
                            repeatCount="indefinite"
                          />
                        </path>
                      ))}
                    </g>

                    {/* 相克箭头 - 虚线 */}
                    <g className="animate-flow">
                      {[
                        'M50 12 L75 78',  // 木克土
                        'M83 37 L27 78',  // 火克金
                        'M73 78 L17 37',  // 土克水
                        'M23 78 L48 12',  // 金克木
                        'M17 33 L83 33'   // 水克火
                      ].map((d, i) => (
                        <path
                          key={i}
                          d={d}
                          fill="none"
                          stroke="#8B5E3C"
                          strokeWidth="0.5"
                          strokeDasharray="2,2"
                          className="opacity-40"
                          markerEnd="url(#glowArrowSmall)"
                        />
                      ))}
                    </g>

                    {/* 发光箭头 */}
                    <defs>
                      <marker
                        id="glowArrow"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="4"
                        markerHeight="4"
                        orient="auto"
                      >
                        <path
                          d="M0 0 L10 5 L0 10 z"
                          fill="#D4B886"
                          filter="url(#elementNeonGlow)"
                        />
                      </marker>
                      <marker
                        id="glowArrowSmall"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="3"
                        markerHeight="3"
                        orient="auto"
                      >
                        <path
                          d="M0 0 L10 5 L0 10 z"
                          fill="#8B5E3C"
                          className="opacity-40"
                        />
                      </marker>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>

            {/* 罗盘部分 */}
            <div className="relative aspect-square">
              <div className="absolute inset-0 animate-morph bg-gradient-to-br from-mystic-200/20 to-mystic-200/10 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] backdrop-blur-sm" />
              <div className="relative w-full h-full transform-gpu hover:scale-105 transition-transform duration-1000">
                <div className="absolute inset-0 transform hover:rotate-30 transition-transform duration-1000">
                  {/* 外圈 - 最慢速度旋转 */}
                  <div className="absolute inset-0 animate-[spin_40s_linear_infinite]">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <defs>
                        <linearGradient id="compassRing" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#D4B886" stopOpacity="0.4" />
                          <stop offset="50%" stopColor="#D4B886" stopOpacity="1" />
                          <stop offset="100%" stopColor="#D4B886" stopOpacity="0.4" />
                        </linearGradient>
                        <pattern id="diagonalHatch" width="3" height="3" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                          <line x1="0" y1="0" x2="0" y2="3" stroke="#D4B886" strokeWidth="0.3" strokeOpacity="0.2" />
                        </pattern>
                      </defs>

                      {/* 装饰环 */}
                      <g filter="url(#softGlow)">
                        {/* 外装饰环 - 最粗 */}
                        <circle
                          cx="50"
                          cy="50"
                          r="48"
                          fill="none"
                          stroke="url(#compassRing)"
                          strokeWidth="1.5"
                          className="opacity-90"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="46"
                          fill="none"
                          stroke="url(#diagonalHatch)"
                          strokeWidth="0.8"
                          className="opacity-40"
                        />
                      </g>

                      {/* 二十四山 */}
                      {[
                        '子', '丑', '寅', '卯', '辰', '巳',
                        '午', '未', '申', '酉', '戌', '亥'
                      ].map((text, i) => {
                        const angle = i * 30;
                        const isNear = angle > 270 || angle < 90;
                        return (
                          <g key={text} filter="url(#softGlow)">
                            <text
                              x="50"
                              y="10"
                              fontSize={isNear ? "4" : "3"}
                              fill="#D4B886"
                              textAnchor="middle"
                              transform={`rotate(${angle} 50 50)`}
                              className={`font-bold opacity-${isNear ? '80' : '60'}`}
                            >
                              {text}
                            </text>
                          </g>
                        );
                      })}

                      {/* 刻度线 */}
                      {Array.from({ length: 360 }).map((_, i) => {
                        const angle = i;
                        const isNear = angle > 270 || angle < 90;
                        const isMajor = i % 30 === 0;  // 二十四山主刻度
                        const isMiddle = i % 15 === 0; // 次要刻度
                        const isMinor = i % 5 === 0;   // 小刻度
                        const length = isMajor ? 4 : (isMiddle ? 3 : (isMinor ? 2 : 1));
                        const opacity = isNear ? 
                          (isMajor ? 0.9 : (isMiddle ? 0.7 : (isMinor ? 0.5 : 0.3))) : 
                          (isMajor ? 0.7 : (isMiddle ? 0.5 : (isMinor ? 0.3 : 0.2)));
                        return (
                          <line
                            key={i}
                            x1="50"
                            y1="5"
                            x2="50"
                            y2={5 + length}
                            stroke="#D4B886"
                            strokeWidth={isMajor ? 0.6 : (isMiddle ? 0.4 : (isMinor ? 0.2 : 0.1))}
                            transform={`rotate(${angle} 50 50)`}
                            className={`opacity-${opacity * 100}`}
                            filter={isMajor ? "url(#softGlow)" : undefined}
                          />
                        );
                      })}

                      {/* 八卦方位 */}
                      {['乾', '兑', '离', '震', '巽', '坎', '艮', '坤'].map((text, i) => {
                        const angle = i * 45;
                        const isNear = angle > 270 || angle < 90;
                        return (
                          <g key={text} filter="url(#softGlow)">
                            <text
                              x="50"
                              y="15"
                              fontSize={isNear ? "5.5" : "4.5"}
                              fill="#D4B886"
                              textAnchor="middle"
                              transform={`rotate(${angle} 50 50)`}
                              className={`font-bold opacity-${isNear ? '90' : '70'}`}
                            >
                              {text}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* 中圈 - 中等速度反向旋转 */}
                  <div className="absolute inset-0 animate-[spin_30s_linear_infinite_reverse]">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <g filter="url(#softGlow)">
                        {/* 中圈装饰 - 中等粗细 */}
                        <circle
                          cx="50"
                          cy="50"
                          r="35"
                          fill="none"
                          stroke="url(#compassRing)"
                          strokeWidth="1.2"
                          className="opacity-80"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="33"
                          fill="url(#diagonalHatch)"
                          className="opacity-20"
                        />
                      </g>

                      {/* 天干文字 */}
                      {['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'].map((text, i) => {
                        const angle = i * 36;
                        const isNear = angle > 270 || angle < 90;
                        return (
                          <g key={text} filter="url(#softGlow)">
                            <text
                              x="50"
                              y="25"
                              fontSize={isNear ? "4.5" : "3.5"}
                              fill="#D4B886"
                              textAnchor="middle"
                              transform={`rotate(${angle} 50 50)`}
                              className={`font-bold opacity-${isNear ? '90' : '70'}`}
                            >
                              {text}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* 内圈 - 最快速度旋转 */}
                  <div className="absolute inset-0 animate-[spin_20s_linear_infinite]">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <defs>
                        <radialGradient id="taijiGlow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#D4B886" stopOpacity="0.6" />
                          <stop offset="70%" stopColor="#D4B886" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#D4B886" stopOpacity="0" />
                        </radialGradient>
                      </defs>

                      <g filter="url(#softGlow)">
                        {/* 内圈装饰 - 最细 */}
                        <circle
                          cx="50"
                          cy="50"
                          r="22"
                          fill="none"
                          stroke="url(#compassRing)"
                          strokeWidth="0.8"
                          className="opacity-70"
                        />
                        {/* 太极图案 */}
                        <path
                          d="M50 30 A20 20 0 0 1 50 70 A10 10 0 0 0 50 50 A10 10 0 0 1 50 30"
                          fill="#D4B886"
                          className="opacity-60"
                        />
                        <circle
                          cx="50"
                          cy="40"
                          r="3"
                          fill="#D4B886"
                          className="opacity-80"
                        />
                        <circle
                          cx="50"
                          cy="60"
                          r="3"
                          fill="none"
                          stroke="#D4B886"
                          strokeWidth="0.6"
                          className="opacity-70"
                        />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 底部说明文字 */}
          <div className="text-center mt-24">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { label: '八卦', desc: '乾坤震巽坎离艮兑' },
                { label: '天干', desc: '甲乙丙丁戊己庚辛壬癸' },
                { label: '五行', desc: '金木水火土' },
                { label: '阴阳', desc: '太极两仪' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="group relative bg-white/30 backdrop-blur-sm rounded-xl p-6 transform hover:-translate-y-2 transition-all duration-500 hover:shadow-neon"
                >
                  <div className="text-xl lg:text-2xl font-bold text-mystic-900 mb-3 group-hover:text-mystic-800 transition-colors">
                    {item.label}
                  </div>
                  <div className="text-sm text-mystic-800/80 group-hover:text-mystic-900/90 transition-colors">
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: 特色板块 */}
      <div className="py-16 lg:py-32 bg-white relative overflow-hidden">
        {/* 装饰图案 */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-0 w-[400px] lg:w-[800px] h-[400px] lg:h-[800px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[400px] lg:w-[800px] h-[400px] lg:h-[800px] bg-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4 lg:mb-6">
              四大核心板块
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-text mb-4 lg:mb-6">
              探索传统医药智慧
            </h2>
            <p className="text-lg lg:text-xl text-gray-600">
              汇集中医药领域精华，助力传统医学发展创新
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                icon: Book,
                title: '经典医著',
                desc: '探索《黄帝内经》、《伤寒论》等中医经典著作的深邃智慧'
              },
              {
                icon: Prescription,
                title: '方剂研究',
                desc: '分享经方验方的临床运用与现代研究成果'
              },
              {
                icon: Stethoscope,
                title: '诊疗心得',
                desc: '交流望闻问切的临床经验与辨证施治的思路方法'
              },
              {
                icon: Leaves,
                title: '养生之道',
                desc: '传承中医养生智慧，实践健康生活方式'
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="group relative bg-white rounded-xl lg:rounded-2xl p-6 lg:p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="w-16 lg:w-20 h-16 lg:h-20 rounded-xl lg:rounded-2xl bg-primary/10 flex items-center justify-center mb-4 lg:mb-6 group-hover:bg-primary/20 transition-colors">
                  <item.icon theme="outline" size="32" className="text-primary" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold mb-3 lg:mb-4">{item.title}</h3>
                <p className="text-gray-600 text-sm lg:text-base mb-4 lg:mb-6">{item.desc}</p>
                <Link 
                  href="/community" 
                  className="inline-flex items-center text-primary hover:text-primary-focus text-base lg:text-lg font-medium gap-2 group-hover:gap-4 transition-all"
                >
                  了解更多
                  <Right theme="outline" size="20" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 热门讨论 */}
      <div className="py-16 lg:py-32 bg-[#FAF6F1]">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4 lg:mb-6">
              社区精选
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-text mb-4 lg:mb-6">
              热门讨论
            </h2>
            <p className="text-lg lg:text-xl text-gray-600">
              发现优质内容，参与专业讨论
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
            {[
              {
                title: '浅谈《伤寒论》太阳病篇的现代临床应用',
                content: '结合临床实践，探讨经方在现代疾病治疗中的应用价值，分享个人临证心得与体会...',
                tags: ['经方', '伤寒论', '临床'],
                likes: 128,
                comments: 32,
                author: {
                  name: '张三丰',
                  avatar: '/images/avatar-1.jpg'
                }
              },
              {
                title: '中医体质辨识与四季养生要点',
                content: '从中医体质学说出发，探讨不同体质人群的养生保健方法，结合四季特点进行调养...',
                tags: ['养生', '体质', '四季'],
                likes: 96,
                comments: 24,
                author: {
                  name: '李四',
                  avatar: '/images/avatar-2.jpg'
                }
              }
            ].map((post, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl lg:rounded-2xl p-6 lg:p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-10 h-10 lg:w-12 lg:h-12">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{post.author.name}</div>
                    <div className="text-sm text-gray-500">中医师</div>
                  </div>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold mb-3 line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 text-sm lg:text-base mb-4 line-clamp-2">{post.content}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-6 text-gray-500 text-sm">
                  <div className="flex items-center gap-2">
                    <Like theme="outline" size="16" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Comment theme="outline" size="16" />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 加入社区 */}
      <div className="py-32 bg-white relative overflow-hidden">
        {/* 装饰图案 */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              加入我们
            </div>
            <h2 className="text-5xl font-bold text-text mb-8">
              共建中医药文化传承创新平台
            </h2>
            <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed">
              在这里，你可以与志同道合的中医药文化爱好者交流探讨，分享经验心得，共同传承和发展中华医药文化
            </p>
            <Link
              href={session ? '/community' : '/login'}
              className="btn btn-primary btn-lg gap-3 min-w-[240px] h-16 text-lg"
            >
              {session ? '开始探索' : '立即加入'}
              <Right theme="outline" size="24" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}