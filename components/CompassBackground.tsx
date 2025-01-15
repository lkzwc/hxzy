import React from 'react'

export default function CompassBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden opacity-10">
      <div className="relative w-[200vh] h-[200vh]">
        {/* 外圈装饰 */}
        <div className="absolute inset-0 animate-spin-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="49" fill="none" stroke="currentColor" strokeWidth="0.2" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.2" />
            {/* 生成24个刻度 */}
            {Array.from({ length: 24 }).map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="5"
                x2="50"
                y2="3"
                stroke="currentColor"
                strokeWidth="0.2"
                transform={`rotate(${i * 15} 50 50)`}
              />
            ))}
            {/* 八卦方位 */}
            {['乾', '兑', '离', '震', '巽', '坎', '艮', '坤'].map((text, i) => (
              <text
                key={text}
                x="50"
                y="10"
                fontSize="2"
                fill="currentColor"
                textAnchor="middle"
                transform={`rotate(${i * 45} 50 50)`}
              >
                {text}
              </text>
            ))}
          </svg>
        </div>

        {/* 内圈装饰 */}
        <div className="absolute inset-0 animate-spin-reverse-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.2" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.2" />
            {/* 生成12个刻度 */}
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="20"
                x2="50"
                y2="18"
                stroke="currentColor"
                strokeWidth="0.2"
                transform={`rotate(${i * 30} 50 50)`}
              />
            ))}
            {/* 天干 */}
            {['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'].map((text, i) => (
              <text
                key={text}
                x="50"
                y="25"
                fontSize="2"
                fill="currentColor"
                textAnchor="middle"
                transform={`rotate(${i * 36} 50 50)`}
              >
                {text}
              </text>
            ))}
          </svg>
        </div>

        {/* 中心装饰 */}
        <div className="absolute inset-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.2" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.2" />
            {/* 太极图案 */}
            <path
              d="M50 35 A15 15 0 0 1 50 65 A7.5 7.5 0 0 0 50 50 A7.5 7.5 0 0 1 50 35"
              fill="currentColor"
              className="opacity-20"
            />
            <circle cx="50" cy="42.5" r="2" fill="currentColor" />
            <circle cx="50" cy="57.5" r="2" fill="none" stroke="currentColor" strokeWidth="0.2" />
          </svg>
        </div>
      </div>
    </div>
  )
} 