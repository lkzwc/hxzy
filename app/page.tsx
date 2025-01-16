'use client'

import { useState, useEffect, Suspense, lazy } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Like, Comment, Book, Prescription, Stethoscope, Leaves, Right } from '@icon-park/react'
import OptimizedImage from '@/components/OptimizedImage'

// 懒加载非首屏组件
const WuXingSection = lazy(() => import('@/components/WuXingSection'))
const FeaturesSection = lazy(() => import('@/components/FeaturesSection'))

// 将特色内容数据移出组件
const features = [
  {
    title: '传统医学智慧',
    desc: '探索中医理论体系，传承千年医药智慧',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=2340&auto=format&fit=crop',
    stats: [
      { label: '历史传承', value: '5000+', unit: '年' },
      { label: '经典著作', value: '300+', unit: '部' },
      { label: '验方记载', value: '10万+', unit: '个' },
    ]
  },
  // ... 其他特色内容
]

export default function Home() {
  const { data: session } = useSession()
  const [activeFeature, setActiveFeature] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return null // 避免服务端渲染不匹配
  }

  return (
    <main className="min-h-screen bg-[#FAF6F1]">
      {/* Hero Section */}
      <section className="relative min-h-[600px] lg:min-h-[800px] bg-gradient-to-b from-[#F5EDE4] to-[#FAF6F1]">
        <div className="container mx-auto px-4 h-full">
          <div className="relative grid lg:grid-cols-12 gap-8 lg:gap-16 items-center py-16 lg:py-32">
            {/* 左侧内容 */}
            <div className="lg:col-span-5 lg:pl-8 text-center lg:text-left">
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
                中医药文化传承与创新平台
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-text mb-6 leading-tight">
                传承千年智慧，
                <br />
                守护<span className="text-primary">现代健康</span>
              </h1>
              <p className="text-lg lg:text-xl text-text/70 mb-8 leading-relaxed">
                探索中医药文化瑰宝，分享养生保健心得
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/community" className="btn btn-primary gap-2">
                  进入社区
                  <Right theme="outline" size="20" />
                </Link>
                <Link href="/about" className="btn btn-outline hover:bg-white/50">
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
                      index === activeFeature ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                  >
                    <div className="relative h-full rounded-2xl overflow-hidden shadow-2xl">
                      <OptimizedImage
                        src={feature.image}
                        alt={feature.title}
                        fill
                        priority={index === 0}
                        className="object-cover"
                      />
                      {/* Feature content */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 懒加载其他部分 */}
      <Suspense fallback={<div className="h-96 flex items-center justify-center">加载中...</div>}>
        <FeaturesSection />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 flex items-center justify-center">加载中...</div>}>
        <WuXingSection />
      </Suspense>
    </main>
  )
}