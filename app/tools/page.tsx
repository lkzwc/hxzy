'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CompassOutlined, RobotOutlined, StarOutlined } from '@ant-design/icons';
import LiuRen from '@/components/tools/LiuRen';
import TimeTable from '@/components/tools/TimeTable';
import ZiWei from '@/components/tools/ZiWei';
import AI from '@/components/tools/AI';

// 工具列表
const tools = [
  {
    id: 'ai-assistant',
    name: 'AI 中医助手',
    description: '智能问诊，辅助诊断',
    icon: <RobotOutlined className="w-8 h-8 text-primary" />,
    link: '/tools/ai-assistant'
  },
  {
    id: 'diagnosis',
    name: '辅助诊断',
    description: '症状分析，证候辨识',
    icon: <CompassOutlined className="w-8 h-8 text-primary" />,
    link: '/tools/diagnosis'
  },
  {
    id: 'favorites',
    name: '收藏夹',
    description: '收藏的工具和资料',
    icon: <StarOutlined className="w-8 h-8 text-primary" />,
    link: '/tools/favorites'
  }
];

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState('liuren');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 relative">
        {/* 主要内容区域 */}
        <div className="sm:ml-[30px] space-y-6">
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors shrink-0 md:shrink w-full
                      ${activeTool === tool.id 
                        ? 'bg-primary/10 text-primary' 
                        : 'hover:bg-gray-100 text-gray-600'}`}
                  >
                    <div className={`flex-shrink-0 ${activeTool === tool.id ? 'text-primary' : 'text-gray-400'}`}>
                      {tool.icon}
                    </div>
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
                {activeTool === 'ai' && <AI />}
                {activeTool === 'ziwei' && <ZiWei />}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}