'use client'
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Footer from './Footer';
import VerticalTitle from './tools/VerticalTitle';

// 页面标题配置
const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/tools': {
    title: '中医工具',
    subtitle: '传统智慧'
  },
  '/yang-sheng-zhi-dao': {
    title: '养生之道',
    subtitle: '健康人生'
  },
  '/yao-cai-tu-pu': {
    title: '药材图谱',
    subtitle: '本草精华'
  },
  '/zhen-jiu-jing-luo': {
    title: '针灸经络',
    subtitle: '经络要诀'
  },
  '/doctors': {
    title: '全国名医',
    subtitle: '医者仁心'
  }
};

const menuItems = [
  { name: '首页', path: '/', description: '首页' },
  { name: '中医工具', path: '/tools', description: '中医工具' },
  { name: '养生之道', path: '/yang-sheng-zhi-dao', description: '养生之道' },
  { name: '药材图谱', path: '/yao-cai-tu-pu', description: '药材图谱' },
  { name: '针灸经络', path: '/zhen-jiu-jing-luo', description: '针灸经络' },
  { name: '全国名医', path: '/doctors' },
  { name: '关于我们', path: '/about-us' }
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // 获取当前页面的标题配置
  const currentPageTitle = pageTitles[pathname];

  // 防止菜单打开时页面滚动
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-primary text-background px-4 md:px-8 py-4 flex justify-between items-center shadow-md relative z-50">
        <Link href="/" className="text-2xl font-bold">
          华夏中医
        </Link>

        {/* 移动端菜单按钮 */}
        <button
          className="md:hidden p-2 hover:bg-primary/80 rounded-lg transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? '关闭菜单' : '打开菜单'}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* 桌面端导航 */}
        <nav className="hidden md:flex items-center">
          <ul className="flex gap-8">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link 
                  href={item.path}
                  className="text-background hover:text-background/80 transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link 
            href="/login" 
            className="ml-8 px-6 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors"
          >
            登录
          </Link>
        </nav>
      </header>

      {/* 移动端菜单 - 使用动画过渡 */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-50 z-40' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />
      <div 
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0 z-50' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <span className="text-lg font-bold text-primary">导航菜单</span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="关闭菜单"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto">
            <ul className="p-4 space-y-2">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="block px-4 py-3 text-text hover:bg-background rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-200">
            <Link
              href="/login"
              className="block w-full px-4 py-3 bg-primary text-white rounded-md text-center hover:bg-primary/90 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              登录
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1 relative">
        {/* 只在配置的页面显示竖直标题 */}
        {currentPageTitle && (
          <VerticalTitle 
            title={currentPageTitle.title}
            subtitle={currentPageTitle.subtitle}
          />
        )}
        {children}
      </main>
      
      <Footer />
    </div>
  );
} 