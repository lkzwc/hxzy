"use client";

import Link from "next/link";
import { useState } from "react";

export default function TestColors() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-800 mb-4">
            🎨 颜色优化测试页面
          </h1>
          <p className="text-lg text-neutral-600">
            测试菜单hover效果和其他UI元素的主色调优化
          </p>
        </div>

        {/* 导航菜单测试 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-primary-800 mb-6">📱 导航菜单测试</h2>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-700">桌面端菜单样式：</h3>
            <nav className="flex items-center gap-2 bg-primary-600 p-4 rounded-xl">
              <ul className="flex items-center gap-1">
                {[
                  { name: "首页", path: "/", active: true },
                  { name: "中医工具", path: "/tools", active: false },
                  { name: "中医社区", path: "/community", active: false },
                  { name: "中医数据库", path: "/zhongyidb", active: false },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.path}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                        ${
                          item.active
                            ? "bg-white/15 text-white"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-secondary-700">移动端菜单样式：</h3>
            <div className="bg-white border border-neutral-200 rounded-xl p-4">
              <ul className="space-y-2">
                {[
                  { name: "首页", path: "/", description: "首页", icon: "🏠", active: true },
                  { name: "中医工具", path: "/tools", description: "中医工具", icon: "🔧", active: false },
                  { name: "中医社区", path: "/community", description: "中医爱好者交流地", icon: "👥", active: false },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.path}
                      className={`flex items-center px-4 py-4 rounded-xl transition-all duration-200 group ${
                        item.active
                          ? "bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 shadow-sm border border-primary-100"
                          : "text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-600"
                      }`}
                    >
                      <span className="text-2xl mr-4 group-hover:scale-110 transition-transform">
                        {item.icon}
                      </span>
                      <div className="flex-1">
                        <div className="font-semibold text-base">{item.name}</div>
                        <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 按钮测试 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-primary-800 mb-6">🔘 按钮样式测试</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-secondary-700">主要按钮</h3>
              <button className="btn btn-primary w-full">
                主要操作
              </button>
              <button className="btn btn-secondary w-full">
                次要操作
              </button>
              <button className="btn btn-outline w-full">
                边框按钮
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-secondary-700">Twitter风格</h3>
              <button className="btn-twitter w-full">
                Twitter按钮
              </button>
              <button className="btn-twitter-outline w-full">
                Twitter边框
              </button>
              <button className="btn-twitter-small w-full">
                小型按钮
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-secondary-700">其他样式</h3>
              <button className="btn btn-ghost w-full">
                幽灵按钮
              </button>
              <button className="btn btn-link w-full">
                链接按钮
              </button>
              <button 
                onClick={() => setShowModal(true)}
                className="w-full px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-700 text-white rounded-xl hover:from-primary-700 hover:to-accent-800 transition-all duration-300"
              >
                测试弹框
              </button>
            </div>
          </div>
        </div>

        {/* 标签测试 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-primary-800 mb-6">🏷️ 标签样式测试</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-secondary-700 mb-4">社区标签（优化后）：</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: "中医", color: "primary" },
                  { name: "养生保健", color: "secondary" },
                  { name: "针灸推拿", color: "accent" },
                  { name: "药膳食疗", color: "amber" },
                  { name: "经验分享", color: "emerald" },
                  { name: "问诊咨询", color: "orange" },
                ].map((tag) => (
                  <span
                    key={tag.name}
                    className={`px-3 py-1.5 bg-${tag.color}-100 text-${tag.color}-600 text-xs font-medium rounded-full 
                      hover:bg-${tag.color}-200 transition-all duration-300 border border-${tag.color}-200 
                      hover:shadow-md transform hover:-translate-y-0.5 cursor-pointer`}
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 数字展示测试 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-primary-800 mb-6">📊 数字展示测试</h2>
          
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: '经典医籍', value: '500+', unit: '部' },
              { label: '方剂收录', value: '8000+', unit: '首' },
              { label: '药材详解', value: '2000+', unit: '种' },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-primary-100/50 hover:border-primary-200/70">
                  <div className="text-2xl lg:text-4xl xl:text-5xl font-bold text-primary-600 mb-2 group-hover:text-primary-700 transition-colors duration-300">
                    {stat.value}
                    <span className="text-base lg:text-lg text-neutral-500 ml-1 font-medium">{stat.unit}</span>
                  </div>
                  <div className="text-xs lg:text-sm text-neutral-600 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 返回链接 */}
        <div className="text-center">
          <Link 
            href="/"
            className="inline-block px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-lg"
          >
            🏠 返回首页
          </Link>
        </div>
      </div>

      {/* 测试弹框 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="relative w-[320px] sm:w-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-3 -right-3 z-10 w-10 h-10 rounded-full bg-white hover:bg-red-50 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group border border-neutral-200 hover:border-red-200"
              title="关闭弹框"
            >
              <svg className="w-5 h-5 text-neutral-600 group-hover:text-red-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <h3 className="text-xl font-bold text-primary-800 mb-4">✨ 优化完成！</h3>
              <p className="text-neutral-600 mb-6">
                登录弹框的关闭按钮已优化，所有蓝色元素已替换为主色调。
              </p>
              <div className="space-y-2 text-sm text-neutral-500">
                <p>✅ 菜单hover效果：蓝色 → 主色调</p>
                <p>✅ 登录弹框关闭按钮：优化样式和交互</p>
                <p>✅ 首页数字展示：增强视觉效果</p>
                <p>✅ 插图素材：蓝色元素 → 主色调</p>
                <p>✅ 标签颜色：移除蓝色，使用中医主题色</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
