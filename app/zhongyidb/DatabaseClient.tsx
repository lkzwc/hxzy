'use client'

import { useState } from 'react'
import { SearchOutlined, BookOutlined, FileTextOutlined, VideoCameraOutlined } from '@ant-design/icons'
import Image from 'next/image'

// 定义数据类型
interface ChineseMedicine {
  id: number; name: string; pinyin: string; category: string
  properties: string; effects: string; usage: string
}
interface ClassicalFormula {
  id: number; name: string; source: string; composition: string
  indications: string; usage: string
}
interface Course {
  id: number; title: string; instructor: string; duration: string
  level: string; description: string; coverImage: string
}
interface EBook {
  id: number; title: string; author: string; dynasty: string
  category: string; description: string; coverImage: string
}

const medicines: ChineseMedicine[] = [
  { id: 1, name: '人参', pinyin: 'Renshen', category: '补虚药', properties: '性微温，味甘微苦', effects: '大补元气，复脉固脱，补脾益肺，生津养血，安神益智', usage: '3-9克' },
  { id: 2, name: '当归', pinyin: 'Danggui', category: '补血药', properties: '性温，味甘辛', effects: '补血活血，调经止痛，润肠通便', usage: '6-15克' },
]

const formulas: ClassicalFormula[] = [
  { id: 1, name: '六味地黄丸', source: '《小儿药证直诀》', composition: '熟地黄、山茱萸、山药、泽泻、牡丹皮、茯苓', indications: '肾阴虚证', usage: '每次9克，每日2次' },
  { id: 2, name: '四君子汤', source: '《太平惠民和剂局方》', composition: '人参、白术、茯苓、甘草', indications: '脾胃虚弱证', usage: '水煎服，每日1剂' },
]

const courses: Course[] = [
  { id: 1, title: '中医基础理论', instructor: '张三', duration: '48课时', level: '入门', description: '系统讲解中医学基本概念、理论体系及诊疗特点', coverImage: '/courses/basic-theory.jpg' },
  { id: 2, title: '方剂学精解', instructor: '李四', duration: '36课时', level: '进阶', description: '深入解析常用方剂的组成、功效及临床应用', coverImage: '/courses/formula-study.jpg' },
]

const ebooks: EBook[] = [
  { id: 1, title: '黄帝内经', author: '佚名', dynasty: '战国至秦汉', category: '理论著作', description: '中医理论体系的奠基之作，包含素问和灵枢两部分', coverImage: '/books/neijing.jpg' },
  { id: 2, title: '伤寒论', author: '张仲景', dynasty: '东汉', category: '经方著作', description: '系统论述外感病的诊断和治疗原则的经典著作', coverImage: '/books/shanghanlun.jpg' },
]

export default function DatabaseClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('zhongyao')

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery, 'in tab:', activeTab)
    }
  }

  return (
    <>
      {/* 搜索区域 - 通过负边距重叠 banner */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto -mt-8">
          <div className="flex items-center bg-white rounded-full shadow-lg border border-white/20">
            <input
              type="text"
              placeholder="搜索中药、经方、课程或电子书..."
              className="flex-1 bg-transparent border-none focus:outline-none text-gray-800 placeholder:text-gray-500 text-sm sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <div className="px-2 sm:px-3">
              <button className="btn bg-primary btn-circle" onClick={handleSearch} aria-label="搜索">
                <SearchOutlined className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="flex justify-center my-8">
          <div className="bg-base-100 shadow-lg rounded-full p-1 flex-nowrap">
            {[
              { id: 'zhongyao', label: '中药', icon: '🌿' },
              { id: 'jingfang', label: '经方', icon: <FileTextOutlined className={`sm:w-5 sm:h-5 ${activeTab === 'jingfang' ? 'text-current' : 'text-gray-600'}`} /> },
              { id: 'kecheng', label: '课程', icon: <VideoCameraOutlined className={`sm:w-5 sm:h-5 ${activeTab === 'kecheng' ? 'text-current' : 'text-gray-600'}`} />, external: true },
              { id: 'dianzishu', label: '电子书', icon: <BookOutlined className={`sm:w-5 sm:h-5 ${activeTab === 'dianzishu' ? 'text-current' : 'text-gray-600'}`} /> },
            ].map(tab => (
              <button
                key={tab.id}
                className={`join-item btn sm:btn-lg gap-1.5 sm:gap-2 rounded-full min-w-[80px] sm:min-w-[160px] text-sm sm:text-base ${activeTab === tab.id ? 'bg-primary' : 'btn-ghost'}`}
                onClick={() => {
                  if ('external' in tab) {
                    window.open('https://yhcpiigo.ap-southeast-1.clawcloudrun.com/', '_blank')
                  } else {
                    setActiveTab(tab.id)
                  }
                }}
              >
                <span className={activeTab === tab.id ? 'text-current' : 'text-gray-600'}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="grid gap-4 sm:gap-8">
          {/* 中药 */}
          {activeTab === 'zhongyao' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {medicines.map(m => (
                <div key={m.id} className="card bg-base-100 shadow hover:shadow-lg sm:shadow-xl sm:hover:shadow-2xl transition-all hover:-translate-y-1">
                  <div className="card-body p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h2 className="card-title text-lg sm:text-2xl">{m.name}</h2>
                      <span className="text-xs sm:text-sm opacity-70">{m.pinyin}</span>
                    </div>
                    <div className="badge badge-primary badge-md sm:badge-lg mb-3 sm:mb-4">{m.category}</div>
                    <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                      <p><span className="font-semibold">性味：</span>{m.properties}</p>
                      <p><span className="font-semibold">功效：</span>{m.effects}</p>
                      <p><span className="font-semibold">用量：</span>{m.usage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 经方 */}
          {activeTab === 'jingfang' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
              {formulas.map(f => (
                <div key={f.id} className="card bg-base-100 shadow hover:shadow-lg sm:shadow-xl sm:hover:shadow-2xl transition-all hover:-translate-y-1">
                  <div className="card-body p-4 sm:p-6">
                    <div className="flex flex-col mb-3 sm:mb-4">
                      <h2 className="card-title text-lg sm:text-2xl mb-1 sm:mb-2">{f.name}</h2>
                      <p className="text-xs sm:text-sm opacity-70">{f.source}</p>
                    </div>
                    <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                      <p><span className="font-semibold">组成：</span>{f.composition}</p>
                      <p><span className="font-semibold">主治：</span>{f.indications}</p>
                      <p><span className="font-semibold">用法：</span>{f.usage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 课程 */}
          {activeTab === 'kecheng' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {courses.map(c => (
                <div key={c.id} className="card bg-base-100 shadow hover:shadow-lg sm:shadow-xl sm:hover:shadow-2xl transition-all hover:-translate-y-1">
                  <figure className="px-4 sm:px-6 pt-4 sm:pt-6">
                    <div className="w-full h-36 sm:h-48 bg-base-200 rounded-xl overflow-hidden">
                      {c.coverImage && <Image src={c.coverImage} alt={c.title} width={400} height={225} className="w-full h-full object-cover" />}
                    </div>
                  </figure>
                  <div className="card-body p-4 sm:p-6">
                    <h2 className="card-title text-lg sm:text-xl">{c.title}</h2>
                    <div className="flex items-center gap-2 text-xs sm:text-sm opacity-70">
                      <span>{c.instructor}</span><span>·</span><span>{c.duration}</span><span>·</span><span>{c.level}</span>
                    </div>
                    <p className="mt-2 text-sm sm:text-base">{c.description}</p>
                    <div className="card-actions justify-end mt-3 sm:mt-4">
                      <button className="btn bg-primary btn-sm sm:btn-md w-full sm:w-auto sm:btn-wide">查看课程</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 电子书 */}
          {activeTab === 'dianzishu' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {ebooks.map(b => (
                <div key={b.id} className="card bg-base-100 shadow hover:shadow-lg sm:shadow-xl sm:hover:shadow-2xl transition-all hover:-translate-y-1">
                  <figure className="px-4 sm:px-6 pt-4 sm:pt-6">
                    <div className="w-full h-56 sm:h-72 bg-base-200 rounded-xl overflow-hidden">
                      {b.coverImage && <Image src={b.coverImage} alt={b.title} width={300} height={400} className="w-full h-full object-cover" />}
                    </div>
                  </figure>
                  <div className="card-body p-4 sm:p-6">
                    <h2 className="card-title text-lg sm:text-xl">{b.title}</h2>
                    <div className="flex items-center gap-2 text-xs sm:text-sm opacity-70">
                      <span>{b.author}</span><span>·</span><span>{b.dynasty}</span>
                    </div>
                    <p className="mt-2 text-sm sm:text-base line-clamp-2">{b.description}</p>
                    <div className="card-actions justify-end mt-3 sm:mt-4">
                      <button className="btn btn-outline btn-sm sm:btn-md w-full sm:w-auto sm:btn-wide">阅读详情</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
