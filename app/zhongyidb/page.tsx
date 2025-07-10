'use client'

import { useState } from 'react'
import { SearchOutlined, BookOutlined, PicCenterOutlined, FileTextOutlined ,VideoCameraOutlined} from '@ant-design/icons'
import Image from 'next/image'

// 定义数据类型
interface ChineseMedicineType {
  id: number
  name: string
  pinyin: string
  category: string
  properties: string
  effects: string
  usage: string
}

interface ClassicalFormula {
  id: number
  name: string
  source: string
  composition: string
  indications: string
  usage: string
}

interface Course {
  id: number
  title: string
  instructor: string
  duration: string
  level: string
  description: string
  coverImage: string
}

interface EBook {
  id: number
  title: string
  author: string
  dynasty: string
  category: string
  description: string
  coverImage: string
}

interface Tab {
  id: string;
  name: string;
}

const tabs: Tab[] = [
  { id: 'zhongyao', name: '中药' },
  { id: 'jingfang', name: '经方' },
  { id: 'kecheng', name: '课程' },
  { id: 'dianzishu', name: '电子书' },
];


export default function ZhongYiDBPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('zhongyao')
  const [searchInput, setSearchInput] = useState('')

  // 添加搜索处理函数
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // 根据activeTab和searchQuery进行搜索
      console.log('Searching for:', searchQuery, 'in tab:', activeTab)
      // TODO: 实现搜索逻辑
    }
  }

  // 添加回车键搜索
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // 示例数据
  const medicines: ChineseMedicineType[] = [
    {
      id: 1,
      name: '人参',
      pinyin: 'Renshen',
      category: '补虚药',
      properties: '性微温，味甘微苦',
      effects: '大补元气，复脉固脱，补脾益肺，生津养血，安神益智',
      usage: '3-9克'
    },
    {
      id: 2,
      name: '当归',
      pinyin: 'Danggui',
      category: '补血药',
      properties: '性温，味甘辛',
      effects: '补血活血，调经止痛，润肠通便',
      usage: '6-15克'
    }
  ]

  const formulas: ClassicalFormula[] = [
    {
      id: 1,
      name: '六味地黄丸',
      source: '《小儿药证直诀》',
      composition: '熟地黄、山茱萸、山药、泽泻、牡丹皮、茯苓',
      indications: '肾阴虚证',
      usage: '每次9克，每日2次'
    },
    {
      id: 2,
      name: '四君子汤',
      source: '《太平惠民和剂局方》',
      composition: '人参、白术、茯苓、甘草',
      indications: '脾胃虚弱证',
      usage: '水煎服，每日1剂'
    }
  ]

  const courses: Course[] = [
    {
      id: 1,
      title: '中医基础理论',
      instructor: '张三',
      duration: '48课时',
      level: '入门',
      description: '系统讲解中医学基本概念、理论体系及诊疗特点',
      coverImage: '/courses/basic-theory.jpg'
    },
    {
      id: 2,
      title: '方剂学精解',
      instructor: '李四',
      duration: '36课时',
      level: '进阶',
      description: '深入解析常用方剂的组成、功效及临床应用',
      coverImage: '/courses/formula-study.jpg'
    }
  ]

  const ebooks: EBook[] = [
    {
      id: 1,
      title: '黄帝内经',
      author: '佚名',
      dynasty: '战国至秦汉',
      category: '理论著作',
      description: '中医理论体系的奠基之作，包含素问和灵枢两部分',
      coverImage: '/books/neijing.jpg'
    },
    {
      id: 2,
      title: '伤寒论',
      author: '张仲景',
      dynasty: '东汉',
      category: '经方著作',
      description: '系统论述外感病的诊断和治疗原则的经典著作',
      coverImage: '/books/shanghanlun.jpg'
    }
  ]

  return (
    <div className="min-h-screen bg-base-100">
      {/* 头部区域 */}
      <div className="bg-gradient-to-b from-primary to-primary-focus text-primary-content py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">中医数据库</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              探索传统中医药的智慧宝库，包含中药、经方、课程和电子书等丰富资源
            </p>
          </div>

          {/* 搜索区域 */}
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center bg-white/95 rounded-full shadow-lg border border-white/20">
              <input
                type="text"
                placeholder="搜索中药、经方、课程或电子书..."
                className="flex-1 bg-transparent border-none focus:outline-none text-gray-800 placeholder:text-gray-500 text-sm sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <div className="px-2 sm:px-3">
                <button 
                  className="btn btn-primary btn-circle"
                  onClick={handleSearch}
                >
                  <SearchOutlined className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="container mx-auto px-4 -mt-8">
        {/* 标签页导航 */}
        <div className="flex justify-center mb-12 overflow-x-auto hide-scrollbar">
          <div className="bg-base-100 mb-10 shadow-lg rounded-full p-1 flex-nowrap">
            <button 
              className={`join-item btn sm:btn-lg gap-1.5 sm:gap-2 rounded-full min-w-[80px] sm:min-w-[160px] text-sm sm:text-base ${activeTab === 'zhongyao' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('zhongyao')}
            >
              <span className={`sm:w-5 sm:h-5 ${activeTab === 'zhongyao' ? 'text-current' : 'text-gray-600'}`}>🌿</span>
              中药
            </button>
            <button 
              className={`join-item btn sm:btn-lg gap-1.5 sm:gap-2 rounded-full min-w-[80px] sm:min-w-[160px] text-sm sm:text-base ${activeTab === 'jingfang' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('jingfang')}
            >
              <FileTextOutlined className={`sm:w-5 sm:h-5 ${activeTab === 'jingfang' ? 'text-current' : 'text-gray-600'}`} />
              经方
            </button>
            <button 
              className={`join-item btn sm:btn-lg gap-1.5 sm:gap-2 rounded-full min-w-[80px] sm:min-w-[160px] text-sm sm:text-base ${activeTab === 'kecheng' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => {
                // setActiveTab('kecheng')
                window.open('https://yhcpiigo.ap-southeast-1.clawcloudrun.com/', '_blank')
              }}
            >
              <VideoCameraOutlined className={`sm:w-5 sm:h-5 ${activeTab === 'kecheng' ? 'text-current' : 'text-gray-600'}`} />
              课程
            </button>
            <button 
              className={`join-item btn sm:btn-lg gap-1.5 sm:gap-2 rounded-full min-w-[80px] sm:min-w-[160px] text-sm sm:text-base ${activeTab === 'dianzishu' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('dianzishu')}
            >
              <BookOutlined className={`sm:w-5 sm:h-5 ${activeTab === 'dianzishu' ? 'text-current' : 'text-gray-600'}`} />
              电子书
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="grid gap-4 sm:gap-8">
          {/* 中药内容 */}
          {activeTab === 'zhongyao' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {medicines.map((medicine) => (
                <div key={medicine.id} className="card bg-base-100 shadow hover:shadow-lg sm:shadow-xl sm:hover:shadow-2xl transition-all hover:-translate-y-1">
                  <div className="card-body p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h2 className="card-title text-lg sm:text-2xl">{medicine.name}</h2>
                      <span className="text-xs sm:text-sm opacity-70">{medicine.pinyin}</span>
                    </div>
                    <div className="badge badge-primary badge-md sm:badge-lg mb-3 sm:mb-4">{medicine.category}</div>
                    <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                      <p><span className="font-semibold">性味：</span>{medicine.properties}</p>
                      <p><span className="font-semibold">功效：</span>{medicine.effects}</p>
                      <p><span className="font-semibold">用量：</span>{medicine.usage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 经方内容 */}
          {activeTab === 'jingfang' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
              {formulas.map((formula) => (
                <div key={formula.id} className="card bg-base-100 shadow hover:shadow-lg sm:shadow-xl sm:hover:shadow-2xl transition-all hover:-translate-y-1">
                  <div className="card-body p-4 sm:p-6">
                    <div className="flex flex-col mb-3 sm:mb-4">
                      <h2 className="card-title text-lg sm:text-2xl mb-1 sm:mb-2">{formula.name}</h2>
                      <p className="text-xs sm:text-sm opacity-70">{formula.source}</p>
                    </div>
                    <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                      <p><span className="font-semibold">组成：</span>{formula.composition}</p>
                      <p><span className="font-semibold">主治：</span>{formula.indications}</p>
                      <p><span className="font-semibold">用法：</span>{formula.usage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 课程内容 */}
          {activeTab === 'kecheng' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {courses.map((course) => (
                <div key={course.id} className="card bg-base-100 shadow hover:shadow-lg sm:shadow-xl sm:hover:shadow-2xl transition-all hover:-translate-y-1">
                  <figure className="px-4 sm:px-6 pt-4 sm:pt-6">
                    <div className="w-full h-36 sm:h-48 bg-base-200 rounded-xl overflow-hidden">
                      {course.coverImage && (
                        <Image
                          src={course.coverImage}
                          alt={course.title}
                          width={400}
                          height={225}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </figure>
                  <div className="card-body p-4 sm:p-6">
                    <h2 className="card-title text-lg sm:text-xl">{course.title}</h2>
                    <div className="flex items-center gap-2 text-xs sm:text-sm opacity-70">
                      <span>{course.instructor}</span>
                      <span>·</span>
                      <span>{course.duration}</span>
                      <span>·</span>
                      <span>{course.level}</span>
                    </div>
                    <p className="mt-2 text-sm sm:text-base">{course.description}</p>
                    <div className="card-actions justify-end mt-3 sm:mt-4">
                      <button className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto sm:btn-wide">查看课程</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 电子书内容 */}
          {activeTab === 'dianzishu' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {ebooks.map((book) => (
                <div key={book.id} className="card bg-base-100 shadow hover:shadow-lg sm:shadow-xl sm:hover:shadow-2xl transition-all hover:-translate-y-1">
                  <figure className="px-4 sm:px-6 pt-4 sm:pt-6">
                    <div className="w-full h-56 sm:h-72 bg-base-200 rounded-xl overflow-hidden">
                      {book.coverImage && (
                        <Image
                          src={book.coverImage}
                          alt={book.title}
                          width={300}
                          height={400}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </figure>
                  <div className="card-body p-4 sm:p-6">
                    <h2 className="card-title text-lg sm:text-xl">{book.title}</h2>
                    <div className="flex items-center gap-2 text-xs sm:text-sm opacity-70">
                      <span>{book.author}</span>
                      <span>·</span>
                      <span>{book.dynasty}</span>
                    </div>
                    <p className="mt-2 text-sm sm:text-base line-clamp-2">{book.description}</p>
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
    </div>
  )
} 