'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState<'about'|'donate'|'admin'>('about');
  const [showQRCode, setShowQRCode] = useState<'wechat'|'alipay'|null>(null);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 标签切换 */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
            {[
              { id: 'about', name: '关于我们' },
              { id: 'donate', name: '支持我们' },
              { id: 'admin', name: '站长介绍' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-2 rounded-md transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white' 
                    : 'text-text hover:bg-background'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* 关于我们 */}
          {activeTab === 'about' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-primary border-b border-primary pb-2">
                关于华夏中医
              </h2>
              <p className="text-text">
                华夏中医网创建于2024年，致力于传承和弘扬中医药文化，为大众提供专业、可靠的中医药知识和服务。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-background rounded-lg p-6">
                  <h3 className="text-xl font-bold text-primary mb-4">我们的使命</h3>
                  <p className="text-text">传承中医文化，服务大众健康</p>
                </div>
                <div className="bg-background rounded-lg p-6">
                  <h3 className="text-xl font-bold text-primary mb-4">我们的愿景</h3>
                  <p className="text-text">让中医文化走进千家万户</p>
                </div>
                <div className="bg-background rounded-lg p-6">
                  <h3 className="text-xl font-bold text-primary mb-4">我们的价值观</h3>
                  <p className="text-text">专业、严谨、创新、服务</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* 支持我们 */}
          {activeTab === 'donate' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-primary border-b border-primary pb-2">
                支持我们
              </h2>
              <p className="text-text">
                如果您觉得我们的内容对您有帮助，欢迎您通过以下方式支持我们：
              </p>
              <div className="flex justify-center gap-8 mt-8">
                <button
                  onClick={() => setShowQRCode('wechat')}
                  className="px-8 py-4 bg-[#07C160] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  微信支付
                </button>
                <button
                  onClick={() => setShowQRCode('alipay')}
                  className="px-8 py-4 bg-[#1677FF] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  支付宝
                </button>
              </div>
              {showQRCode && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-centers">
                  <div className="bg-white p-8 rounded-lg relative">
                    <button
                      onClick={() => setShowQRCode(null)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    >
                      关闭
                    </button>
                    <div className="w-64 h-64 bg-gray-100 flex items-center justify-center">
                      {/* 替换为实际的二维码图片 */}
                      <p className="text-text">
                        {showQRCode === 'wechat' ? '微信' : '支付宝'}支付二维码
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* 站长介绍 */}
          {activeTab === 'admin' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-primary border-b border-primary pb-2">
                站长介绍
              </h2>
              <div className="grid items-center md:flex items-start gap-8">
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex-shrink-0">
                  {/* 站长头像 */}
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-primary">张三</h3>
                  <p className="text-text">
                    中医爱好者，软件工程师，致力于将传统中医文化与现代技术相结合。
                  </p>
                  <div className="space-y-2">
                    <p className="text-text">个人简介：</p>
                    <ul className="list-disc list-inside text-text space-y-1">
                      <li>10年软件开发经验</li>
                      <li>5年中医学习经验</li>
                      <li>热爱传统文化</li>
                      <li>致力于中医文化传播</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 