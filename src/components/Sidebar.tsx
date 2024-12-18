import Link from 'next/link';

// 定义导航菜单项
export const navItems = [
  { name: '每日养生', path: '/yang-sheng-zhi-dao' },
  { name: '四季调养', path: '/si-ji-tiao-yang' },
  { name: '中医典籍', path: '/zhong-yi-dian-ji' },
  { name: '中医社区', path: '/community' },
];

export default function Sidebar(props: { size?: 'normal' | 'small' }) {
    const { size = "normal" } = props
  return (
    <div className={`hidden md:block bg-white rounded-lg shadow-md p-4 md:${size==='normal' ? 'w-64 ml-12' : 'w-12 ml-44'}`}>
      <h2 className="text-primary text-xl font-bold mb-4 pb-2 border-b-2 border-secondary">
        快速导航
      </h2>
      <nav>
        <ul className="space-y-3">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link 
                href={item.path}
                className="text-text cursor-pointer hover:text-secondary hover:pl-2 transition-all duration-300 block"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
} 