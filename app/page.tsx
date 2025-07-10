import { Suspense } from 'react'

// 网站核心功能展示数据
const features = [
  {
    title: '中医知识宝库',
    desc: '汇聚经典医籍、方剂药材、诊疗心得',
    image: '/images/tcm-wisdom.svg',
    stats: [
      { label: '经典医籍', value: '500+', unit: '部' },
      { label: '方剂收录', value: '8000+', unit: '首' },
      { label: '药材详解', value: '2000+', unit: '种' },
    ],
    features: ['《黄帝内经》解读', '经方验方研究', '本草纲目详解', '名医医案分析']
  },
  {
    title: '智能诊疗工具',
    desc: '现代科技助力中医诊断与学习',
    image: '/images/modern-tech.svg',
    stats: [
      { label: '在线工具', value: '20+', unit: '个' },
      { label: '用户使用', value: '50万+', unit: '次' },
      { label: '准确率', value: '95%+', unit: '' },
    ],
    features: ['五行体质测试', '经络穴位查询', '方剂配伍分析', '症状智能诊断']
  },
  {
    title: '中医学习社区',
    desc: '中医爱好者交流学习的专业平台',
    image: '/images/community.svg',
    stats: [
      { label: '用户', value: '10万+', unit: '人' },
      { label: '讨论话题', value: '5000+', unit: '个' },
      { label: '专业医师', value: '1000+', unit: '位' },
    ],
    features: ['学术讨论交流', '临床经验分享', '名医在线答疑', '中医文化传播']
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
                华夏<span className="text-primary-600">中医</span>
                <br />
                传承<span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">千年智慧</span>
              </h1>

              <p className="text-xl text-neutral-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                汇聚中医经典知识，提供智能诊疗工具，打造专业学习社区，让传统医学在现代焕发新生
              </p>
              
              <HomeButtons />

              {/* 统计数据 */}
              <div className="grid grid-cols-3 gap-4 lg:gap-8 mt-16">
                {features[0].stats.map((stat, index) => (
                  <div key={stat.label} className="text-center lg:text-left group">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-primary-100/50 hover:border-primary-200/70">
                      <div className="text-2xl lg:text-4xl xl:text-5xl font-bold text-primary-600 mb-2 group-hover:text-primary-700 transition-colors duration-300">
                        {stat.value}
                        <span className="text-base lg:text-lg text-neutral-500 ml-1 font-medium">{stat.unit}</span>
                      </div>
                      <div className="text-xs lg:text-sm text-neutral-600 font-medium">{stat.label}</div>
                    </div>
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

      {/* 核心功能展示 */}
      <section className="py-20 bg-gradient-to-b from-white to-primary-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-800 mb-4">
              三大核心功能
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              从知识学习到智能诊疗，从社区交流到文化传承，全方位的中医药服务平台
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="aspect-video mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <h3 className="text-2xl font-bold text-neutral-800 mb-3">
                  {feature.title}
                </h3>

                <p className="text-neutral-600 mb-6">
                  {feature.desc}
                </p>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {feature.stats.map((stat) => (
                    <div key={stat.label} className="text-center bg-gradient-to-br from-primary-50/50 to-secondary-50/50 rounded-xl p-3 hover:from-primary-100/50 hover:to-secondary-100/50 transition-all duration-300">
                      <div className="text-xl lg:text-2xl font-bold text-primary-600 mb-1">
                        {stat.value}
                        <span className="text-xs lg:text-sm text-neutral-500 ml-1 font-medium">{stat.unit}</span>
                      </div>
                      <div className="text-xs text-neutral-600 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <div key={idx} className="flex items-center text-sm text-neutral-600">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
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