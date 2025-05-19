import { Suspense, lazy } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'

// 静态数据 - 使用更小的图片尺寸和webp格式
const features = [
  {
    title: '传统医学智慧',
    desc: '探索中医理论体系，传承千年医药智慧',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1080&fm=webp',
    stats: [
      { label: '历史传承', value: '5000+', unit: '年' },
      { label: '经典著作', value: '300+', unit: '部' },
      { label: '验方记载', value: '10万+', unit: '个' },
    ]
  },
  {
    title: '现代科技融合',
    desc: '结合现代科技，创新中医药发展',
    image: 'https://images.unsplash.com/photo-1512290746430-3ffb4fab31bc?q=80&w=1080&fm=webp',
    stats: [
      { label: '数字化医案', value: '100万+', unit: '例' },
      { label: 'AI 辅助诊断', value: '95%+', unit: '准确率' },
      { label: '研究成果', value: '1000+', unit: '项' },
    ]
  },
]

// 客户端组件 - 使用动态导入
import ClientHeroSection from '@/components/home/ClientHeroSection'
import HomeButtons from '@/components/home/HomeButtons'
import { LazyFeatureSection, LazyLuopanSection } from '@/components/home/LazyComponents'

// 优化的骨架屏组件
function HeroSkeleton() {
  return (
    <div className="aspect-square relative rounded-2xl overflow-hidden shadow-lg bg-neutral-100">
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-200/50 to-neutral-300/50 animate-pulse" />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 p-6">
        <div className="h-6 w-1/3 bg-white/60 rounded-md mb-4 animate-pulse" />
        <div className="h-4 w-2/3 bg-white/40 rounded-md animate-pulse" />
      </div>
    </div>
  );
}

export default async function Home() {
  return (
    <main className="bg-gradient-to-b from-primary-50 via-white to-neutral-50">
      {/* Hero Section - 首屏内容优先加载 */}
      <section className="relative">
        {/* 装饰背景 - 简化初始渲染 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100/30 rounded-full filter blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-100/20 rounded-full filter blur-2xl" />
        </div>

        <div className="container mx-auto px-4 h-full pt-24 lg:pt-32">
          <div className="relative grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* 左侧内容 - 关键内容优先渲染 */}
            <div className="lg:col-span-6 lg:pl-8 text-center lg:text-left relative z-10">
              <div 
                className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full 
                text-primary-600 text-sm font-medium mb-6 shadow-sm border border-primary-100"
              >
                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                中医药文化传承与创新平台
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-neutral-800 mb-8 leading-tight">
                传承<span className="text-primary-600">千年智慧</span>
                <br />
                守护<span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-500">现代健康</span>
              </h1>
              
              <p className="text-xl text-neutral-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                探索中医药文化瑰宝，融合现代科技创新，让传统智慧在当代焕发新生
              </p>
              
              <HomeButtons />

              {/* 统计数据 */}
              <div className="grid grid-cols-3 gap-8 mt-16 text-center lg:text-left">
                {features[0].stats.map((stat, index) => (
                  <div key={stat.label} className="space-y-2">
                    <div className="text-3xl lg:text-4xl font-bold text-primary-600">
                      {stat.value}
                      <span className="text-lg text-neutral-500 ml-1">{stat.unit}</span>
                    </div>
                    <div className="text-sm text-neutral-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 右侧特色内容 - 使用优化的骨架屏 */}
            <div className="lg:col-span-6 relative mt-12 lg:mt-0">
              <Suspense fallback={<HeroSkeleton />}>
                <ClientHeroSection features={features} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* 非首屏内容 - 使用懒加载 */}
      <LazyFeatureSection />
      
      {/* WuXing Section - 最后加载 */}
      <div className="bg-gradient-to-b from-primary-50 to-primary-100/50">
        <LazyLuopanSection />
      </div>
    </main>
  )
}