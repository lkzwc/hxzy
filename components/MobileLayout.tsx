'use client'
import { useState } from 'react';
import Link from 'next/link';

export default function MobileLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* 移动端导航栏 */}
      <header className="bg-primary text-background px-4 py-3 flex items-center justify-between md:hidden">
        <div className="text-xl font-bold">华夏中医</div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
          <div className="bg-white w-64 h-full">
            <div className="p-4">
              <nav className="space-y-4">
                {['首页', '中医工具', '养生之道', '中医数据库', '针灸经络', '全国名医', '关于我们'].map((item) => (
                  <Link
                    key={item}
                    href={item === '首页' ? '/' : 
                          item === '中医工具' ? '/tools' : 
                          item === '全国名医' ? '/doctors' : 
                          `/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block px-4 py-2 text-text hover:bg-background rounded-md"
                  >
                    {item}
                  </Link>
                ))}
                <Link
                  href="/login"
                  className="block px-4 py-2 mt-4 bg-secondary text-white rounded-md hover:bg-secondary/90 text-center"
                >
                  登录
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}