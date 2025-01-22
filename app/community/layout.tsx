'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { categories } from '@/util/common'
import QrCodeCarousel from '@/components/QrCodeCarousel'


export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [qrCodes, setQrCodes] = useState([])

  useEffect(() => {
    // 获取二维码数据
    fetch('/api/qrcodes')
      .then(res => res.json())
      .then(data => setQrCodes(data))
      .catch(error => console.error('Error fetching QR codes:', error))
  }, [])

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="flex gap-2 mt-4 sm:ml-16">
        {/* 左侧筛选区 - 固定位置 */}
        <div className="w-[150px] hidden md:block">
          <div className="fixed w-[150px]">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <h3 className="text-base font-medium mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
                <span className="w-0.5 h-4 bg-primary rounded-full"></span>
                分类筛选
              </h3>
              <div className="flex flex-col gap-2">
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={category === '全部' ? '/community' : `/community?tag=${category}`}
                    className={`px-3 py-1.5 rounded-md transition-colors text-sm text-left hover:bg-gray-50 text-gray-600`}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 中间内容区 */}
        <div className="flex-1 min-w-0">
          {children}
        </div>

        {/* 右侧边栏 - 固定位置 */}
        <div className="w-[240px] hidden lg:block">
          <div className="fixed w-[240px] space-y-4">
            {/* 热门话题 */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <h3 className="text-base font-medium mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
                <span className="w-0.5 h-4 bg-primary rounded-full"></span>
                热门话题
              </h3>
              <div className="space-y-2.5">
                {['经方临床实践', '四气五味辨证', '针灸要穴'].map((topic, index) => (
                  <div key={index} className="flex items-center gap-2 group cursor-pointer">
                    <span className={`w-5 h-5 rounded flex items-center justify-center text-xs
                      ${index < 3 ? 'bg-primary/10 text-primary' : 'bg-gray-50 text-gray-500'}`}>
                      {index + 1}
                    </span>
                    <span className="text-gray-700 text-sm group-hover:text-primary transition-colors">
                      {topic}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 活跃作者 */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <h3 className="text-base font-medium mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
                <span className="w-0.5 h-4 bg-primary rounded-full"></span>
                活跃作者
              </h3>
              <div className="space-y-3">
                {['张三丰', '李时珍', '孙思邈'].map((author, index) => (
                  <div key={index} className="flex items-center gap-2.5 group cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm">
                      {author[0]}
                    </div>
                    <div>
                      <div className="text-sm text-gray-900 group-hover:text-primary transition-colors">{author}</div>
                      <div className="text-xs text-gray-500">发帖 {30 - index * 5}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 广告区 */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <h3 className="text-base font-medium mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
                <span className="w-0.5 h-4 bg-primary rounded-full"></span>
                广告区
              </h3>
              <div className="aspect-square">
                <QrCodeCarousel qrCodes={qrCodes} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 