'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LiuRen from '@/components/tools/LiuRen';
import TimeTable from '@/components/tools/TimeTable';

// 工具列表
const tools = [
  {
    id: 'liuren',
    name: '小六壬占卜',
    icon: '🔮',
    description: '传统预测方法，用于预测事情吉凶'
  },
  {
    id: 'ai',
    name: 'AI中医',
    icon: '🔮',
    description: '传统预测方法，用于预测事情吉凶'
  },
  // ... 其他工具配置保持不变
];

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState('liuren');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 relative">
        {/* 主要内容区域 */}
        <div className="ml-[30px] space-y-6">
          {/* 十二时辰对照表 */}
          <TimeTable />

          {/* 工具区域 */}
          <div className="grid grid-cols-1 md:grid-cols-[280px,1fr] gap-6">
            {/* 左侧工具导航 */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-bold text-primary mb-4 pb-2 border-b border-gray-200">
                工具导航
              </h2>
              <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-md transition-colors shrink-0 md:shrink
                      ${activeTool === tool.id 
                        ? 'bg-primary/10 text-primary' 
                        : 'hover:bg-gray-100 text-gray-600'}`}
                  >
                    <span className="text-xl">{tool.icon}</span>
                    <div className="text-left">
                      <div className="font-medium whitespace-nowrap">{tool.name}</div>
                      <div className="text-xs text-gray-500 hidden md:block">{tool.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 右侧工具内容 */}
            <div className="">
              <AnimatePresence mode="wait">
                {activeTool === 'liuren' && <LiuRen />}
                {activeTool === 'meridian' && (
                  <motion.div
                    key="meridian"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <h2 className="text-xl font-bold text-primary mb-4">
                      子午流注
                    </h2>
                    <p className="text-gray-600">
                      正在开发中...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 