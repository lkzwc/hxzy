'use client'
import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  avatar: string;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  category: string;
  createTime: string;
}

const categories = ['全部', '经方', '养生', '针灸', '中药', '诊断', '心得'];

const samplePosts: Post[] = [
  {
    id: 1,
    title: "浅谈《黄帝内经》中的养生智慧",
    content: "《黄帝内经》云：上古之人，其知道者，法于阴阳...",
    author: "张三丰",
    avatar: "/avatars/1.jpg",
    views: 3600,
    likes: 120,
    comments: 45,
    tags: ["经典研究", "养生之道"],
    category: "养生",
    createTime: "2024-03-20"
  },
  {
    id: 2,
    title: "四气五味在临床辨证中的应用",
    content: "中医理论中的四气五味，对于临床辨证施治有重要指导意义...",
    author: "李时珍",
    avatar: "/avatars/2.jpg",
    views: 2580,
    likes: 89,
    comments: 32,
    tags: ["辨证论治", "中医理论"],
    category: "诊断",
    createTime: "2024-03-19"
  }
];

function CommunityPage() {
  const [posts] = useState<Post[]>(samplePosts);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col md:flex-row p-3 gap-3">
      <Sidebar  size='small'/>
      
      <div className="flex-1">
        {/* 搜索和筛选区 - 更紧凑的设计 */}
        <div className="bg-white/80 backdrop-blur rounded-lg shadow-sm p-3 mb-3 border border-primary/10">
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="搜索帖子..."
                className="w-full pl-9 pr-3 py-1.5 border-0 bg-gray-50 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/30 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="absolute left-2.5 top-2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-md hover:bg-gray-100 text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 12h18M3 20h18" />
              </svg>
              筛选
            </button>
            <button className="bg-primary/90 text-white px-4 py-1.5 rounded-md hover:bg-primary transition-colors text-sm flex items-center gap-1.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              发布文章
            </button>
          </div>
        </div>

        {/* 分类标签 - 中国风设计 */}
        <div className="bg-white/80 backdrop-blur rounded-lg shadow-sm p-3 mb-3 border border-primary/10">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-3 py-1 rounded-md transition-colors text-sm whitespace-nowrap
                  ${activeCategory === category 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'hover:bg-gray-50 border border-gray-100 text-gray-600'
                  }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 帖子列表 - 优化布局 */}
        <div className="space-y-3">
          {posts.map((post) => (
            <div 
              key={post.id}
              className="bg-white/80 backdrop-blur rounded-lg shadow-sm p-4 hover:shadow transition-shadow
                border-l-[3px] border border-primary/10 border-l-primary/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Link 
                    href={`/community/post/${post.id}`}
                    className="text-lg font-medium text-gray-900 hover:text-primary line-clamp-1 block"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-1.5 text-gray-600 text-sm line-clamp-2">{post.content}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {post.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {post.comments}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {post.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-2 py-0.5 bg-primary/5 text-primary text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <img 
                    src={post.avatar} 
                    alt={post.author}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="text-gray-600 text-xs">{post.author}</span>
                  <span className="text-gray-400 text-xs">·</span>
                  <span className="text-gray-400 text-xs">{post.createTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧边栏 - 中国风设计 */}
      <div className="w-[280px] space-y-3">
        {/* 热门话题 */}
        <div className="bg-white/80 backdrop-blur rounded-lg shadow-sm p-4 border border-primary/10">
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
        <div className="bg-white/80 backdrop-blur rounded-lg shadow-sm p-4 border border-primary/10">
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
      </div>
    </div>
  );
}

export default CommunityPage; 