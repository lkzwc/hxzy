'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface Feature {
  title: string
  desc: string
  image: string
  stats: Array<{
    label: string
    value: string
    unit: string
  }>
}

interface Props {
  features: Feature[]
}

export default function ClientHeroSection({ features }: Props) {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // 延迟启动轮播，减少初始加载时的性能消耗
  useEffect(() => {
    // 先标记组件已加载
    setIsLoaded(true)
    
    // 延迟2秒后再开始轮播，减轻初始加载压力
    const startTimer = setTimeout(() => {
      timerRef.current = setInterval(() => {
        setActiveFeature((prev) => (prev + 1) % features.length)
      }, 6000)
    }, 2000)
    
    return () => {
      clearTimeout(startTimer)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [features.length])

  return (
    <div className="relative">
      {/* 装饰元素 */}
      <div className="absolute -right-8 -top-8 w-64 h-64 bg-primary-100/30 rounded-full blur-3xl" />
      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-secondary-100/30 rounded-full blur-2xl" />

      {/* 主要内容 */}
      <div className="relative aspect-square">
        <AnimatePresence mode="wait">
          {features.map((feature, index) => (
            index === activeFeature && (
              <motion.div
                  key={feature.title}
                  initial={index === 0 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: index === 0 ? 0 : 0.5 }}
                  className="absolute inset-0"
                >
                <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                  {/* 图片遮罩渐变 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
                  
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={75}
                    onLoad={() => index === 0 && setIsLoaded(true)}
                  />

                  {/* 内容覆盖层 */}
                  <motion.div 
                    className="absolute inset-0 z-20 p-8 flex flex-col justify-end"
                    initial={index === 0 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index === 0 ? 0 : 0.2, duration: index === 0 ? 0 : 0.5 }}
                  >
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-white/90 mb-6 line-clamp-2">
                      {feature.desc}
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      {feature.stats.map((stat, idx) => (
                        <motion.div
                          key={stat.label}
                          initial={index === 0 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index === 0 ? 0 : 0.4 + idx * 0.1, duration: index === 0 ? 0 : 0.3 }}
                          className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center"
                        >
                          <div className="text-xl font-bold text-white">
                            {stat.value}
                            <span className="text-sm ml-1">{stat.unit}</span>
                          </div>
                          <div className="text-xs text-white/80">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* 导航点 */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex space-x-2">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveFeature(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeFeature 
                  ? 'bg-primary-600 w-6' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`切换到第 ${index + 1} 张图片`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}