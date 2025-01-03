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
      {/* 顶部横幅 */}
      <div className="relative min-h-[800px] bg-gradient-to-b from-[#F5EDE4] to-[#FAF6F1] overflow-hidden">
        {/* 装饰图案 */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute inset-0 bg-[url('/images/bg-pattern.png')] opacity-5" />
        </div>

        <div className="container mx-auto px-4 h-full">
          <div className="relative grid lg:grid-cols-12 gap-16 items-center py-32">
            {/* 左侧内容 */}
            <div className="lg:col-span-5 lg:pl-8">
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-8">
                中医药文化传承与创新平台
              </div>
              <h1 className="text-6xl font-bold text-text mb-8 leading-tight">
                传承千年智慧，
                <br />
                守护<span className="text-primary">现代健康</span>
              </h1>
              <p className="text-xl text-text/70 mb-12 leading-relaxed">
                探索中医药文化瑰宝，分享养生保健心得，
                <br />
                共同传承和发展中华民族的传统医药文化
              </p>
              <div className="flex gap-6">
                <Link 
                  href="/community" 
                  className="btn btn-primary btn-lg gap-2 min-w-[180px] h-16 text-lg"
                >
                  进入社区
                  <Right theme="outline" size="24" />
                </Link>
                <Link 
                  href="/about" 
                  className="btn btn-outline btn-lg h-16 text-lg hover:bg-white/50"
                >
                  了解更多
                </Link>
              </div>
            </div>

            {/* 右侧特色内容 */}
            <div className="lg:col-span-7 relative">
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
                    <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-12">
                        <h3 className="text-3xl font-bold text-white mb-4">{feature.title}</h3>
                        <p className="text-xl text-white/90 mb-8">{feature.desc}</p>
                        <div className="grid grid-cols-3 gap-8">
                          {feature.stats.map((stat, i) => (
                            <div key={i} className="text-center">
                              <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                              <div className="text-base text-white/80">{stat.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* 切换指示器 */}
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
                {features.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeFeature
                        ? 'w-12 bg-primary'
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

      {/* 特色板块 */}
      <div className="py-32 bg-white relative overflow-hidden">
        {/* 装饰图案 */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              四大核心板块
            </div>
            <h2 className="text-4xl font-bold text-text mb-6">
              探索传统医药智慧
            </h2>
            <p className="text-xl text-gray-600">
              汇集中医药领域精华，助力传统医学发展创新
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                className="group relative bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <item.icon theme="outline" size="40" className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-600 text-base mb-6">{item.desc}</p>
                <Link 
                  href="/community" 
                  className="inline-flex items-center text-primary hover:text-primary-focus text-lg font-medium gap-2 group-hover:gap-4 transition-all"
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
      <div className="py-32 bg-[#FAF6F1]">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              社区精选
            </div>
            <h2 className="text-4xl font-bold text-text mb-6">
              热门讨论
            </h2>
            <p className="text-xl text-gray-600">
              发现优质内容，参与专业讨论
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
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
                  name: '李时珍',
                  avatar: '/images/avatar-2.jpg'
                }
              }
            ].map((post, index) => (
              <Link
                key={index}
                href={`/community/${index + 1}`}
                className="group bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="flex items-center gap-4 mb-6">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-bold text-lg">{post.author.name}</div>
                    <div className="text-sm text-gray-500">中医师</div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-gray-600 text-base mb-6 line-clamp-2">{post.content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-6 text-gray-500">
                    <span className="flex items-center gap-2">
                      <Like theme="outline" size="18" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-2">
                      <Comment theme="outline" size="18" />
                      {post.comments}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link 
              href="/community" 
              className="btn btn-outline btn-lg gap-2 min-w-[240px] h-16 text-lg hover:bg-white/50"
            >
              查看更多讨论
              <Right theme="outline" size="20" />
            </Link>
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