'use client'

import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  
  // 如果是社区页面则不显示
  if (pathname?.startsWith('/community')) {
    return null
  }

  return (
    <footer className="mt-auto bg-primary text-background py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 网站信息 */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-lg md:text-xl font-bold border-b border-primary pb-2">关于我们</h3>
            <p className="text-background text-sm md:text-base">
              华夏中医网致力于传承和弘扬中医药文化，
              传播养生保健知识，服务大众健康。
            </p>
            <p className="text-background text-sm md:text-base">
              联系电话：15556355573
              <br />
              邮箱：liuketh@qq.com
            </p>
          </div>

          {/* 快速链接 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b border-primary pb-2">快速链接</h3>
            <ul className="space-y-2">
              {['关于我们', '联系方式', '服务条款', '隐私政策'].map((item) => (
                <li key={item} className="hover:text-secondary/90 cursor-pointer text-background">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 友情链接 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b border-primary pb-2">友情链接</h3>
            <ul className="space-y-2">
              {[
                { name: '中医药管理局', url: '#' },
                { name: '国家药典委员会', url: '#' }
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.url} 
                    className="hover:text-secondary/90 cursor-pointer text-background"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 公众号 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b border-primary pb-2">关注我们</h3>
            <div className="bg-white p-2 rounded-lg w-32 h-32 flex items-center justify-center">
              {/* 这里替换成实际的二维码图片 */}
              <div className="text-primary text-center text-sm">
                <p>扫描关注</p>
                <p>官方公众号</p>
              </div>
            </div>
            <p className="text-background text-sm">
              关注公众号，获取最新养生资讯
            </p>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="mt-8 pt-4 border-t border-background/20 text-center">
          <p className="text-sm md:text-base text-background">
            © {new Date().getFullYear()} 华夏中医网. All rights reserved.
          </p>
          <p className="mt-2 text-xs md:text-sm text-background/80">
            备案号：陕西ICP备XXXXXXXX号-1 
          </p>
        </div>
      </div>
    </footer>
  );
} 