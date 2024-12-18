'use client'
import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

interface Post {
  id: number;
  title: string;
  author: string;
  views: number;
  replies: number;
  lastReply: string;
  tags: string[];
}

const samplePosts: Post[] = [
  {
    id: 1,
    title: "中医治疗失眠的有效方法探讨",
    author: "张医生",
    views: 3600,
    replies: 12,
    lastReply: "2024-03-20",
    tags: ["失眠", "中医疗法"]
  },
  {
    id: 2,
    title: "四季养生之春季调养要点",
    author: "李大夫",
    views: 2580,
    replies: 8,
    lastReply: "2024-03-19",
    tags: ["春季养生", "养生保健"]
  },
  // 添加更多示例帖子...
];

export default function Forum() {
  const [posts] = useState<Post[]>(samplePosts);

  return (
    <div className="flex flex-col md:flex-row p-4 gap-4">
      <Sidebar />
      
      <div className="flex-1">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-primary">中医论坛</h1>
            <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              发布新帖
            </button>
          </div>

          <div className="space-y-4">
            {posts.map((post) => (
              <div 
                key={post.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <Link 
                    href={`/forum/post/${post.id}`}
                    className="text-lg font-medium text-primary hover:text-primary/80"
                  >
                    {post.title}
                  </Link>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>浏览: {post.views}</span>
                    <span>回复: {post.replies}</span>
                  </div>
                </div>
                
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {post.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-2 py-1 bg-primary/5 text-primary text-sm rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="mr-4">作者: {post.author}</span>
                    <span>最后回复: {post.lastReply}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 