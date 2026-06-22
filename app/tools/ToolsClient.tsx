'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CompassOutlined, RobotOutlined, StarOutlined } from '@ant-design/icons';
import LiuRen from '@/components/tools/LiuRen';
import ZiWei from '@/components/tools/ZiWei';
import AI from '@/components/tools/AI';

const tools = [
  {
    id: 'ai',
    name: 'AI 中医助手',
    description: '智能问诊，辅助诊断',
    icon: <RobotOutlined className="w-8 h-8 text-primary" />,
  },
  {
    id: 'diagnosis',
    name: '辅助诊断',
    description: '症状分析，证候辨识',
    icon: <CompassOutlined className="w-8 h-8 text-primary" />,
  },
  {
    id: 'liuren',
    name: '小六壬',
    description: '当断不断就来卜一卦',
    icon: <StarOutlined className="w-8 h-8 text-primary" />,
  },
  {
    id: 'ziwei',
    name: '紫微斗数',
    description: '当断不断就来卜一卦',
    icon: <div style={{ margin: '0px 7px' }}>🧭</div>,
  },
];

export default function ToolsClient() {
  const [activeTool, setActiveTool] = useState('liuren');

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px,1fr] gap-6">
      {/* 左侧工具导航 */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-bold text-primary mb-4 pb-2 border-b border-gray-200">
          工具导航🌠
        </h2>
        <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors shrink-0 md:shrink md:w-full
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
      <div>
        <AnimatePresence mode="wait">
          {activeTool === 'liuren' && (
            <motion.div
              key="liuren"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <LiuRen />
            </motion.div>
          )}
          {activeTool === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <AI />
            </motion.div>
          )}
          {activeTool === 'ziwei' && (
            <motion.div
              key="ziwei"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <ZiWei />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
