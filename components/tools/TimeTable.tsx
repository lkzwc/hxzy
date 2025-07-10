'use client'
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// 时辰单位类型定义
interface TimeUnit {
  name: string;
  period: string;
  zodiac: string;
}

// 时辰数据
const timeUnits: TimeUnit[] = [
  { name: '子时', period: '23:00-01:00', zodiac: '鼠' },
  { name: '丑时', period: '01:00-03:00', zodiac: '牛' },
  { name: '寅时', period: '03:00-05:00', zodiac: '虎' },
  { name: '卯时', period: '05:00-07:00', zodiac: '兔' },
  { name: '辰时', period: '07:00-09:00', zodiac: '龙' },
  { name: '巳时', period: '09:00-11:00', zodiac: '蛇' },
  { name: '午时', period: '11:00-13:00', zodiac: '马' },
  { name: '未时', period: '13:00-15:00', zodiac: '羊' },
  { name: '申时', period: '15:00-17:00', zodiac: '猴' },
  { name: '酉时', period: '17:00-19:00', zodiac: '鸡' },
  { name: '戌时', period: '19:00-21:00', zodiac: '狗' },
  { name: '亥时', period: '21:00-23:00', zodiac: '猪' },
];

// 获取当前时辰
export const getCurrentTimeUnit = (): TimeUnit => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours * 100 + minutes;

  // 特殊处理跨日的子时
  if (currentTime >= 2300 || currentTime < 100) {
    return timeUnits[0];
  }

  // 其他时辰1
  const timeMap: { [key: number]: number } = {
    1: 1, 3: 2, 5: 3, 7: 4, 9: 5, 11: 6,
    13: 7, 15: 8, 17: 9, 19: 10, 21: 11, 23: 0
  };

  const index = timeMap[Math.floor((hours + 1) / 2) * 2 - 1];
  return timeUnits[index];
};

export default function TimeTable() {
  const [currentTime, setCurrentTime] = useState<TimeUnit | null>(null);

  useEffect(() => {
    // 初始化当前时辰
    setCurrentTime(getCurrentTimeUnit());

    // 每分钟更新一次
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTimeUnit());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-bold text-primary mb-3 pb-2 border-b border-gray-200">
        十二时辰对照表
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {timeUnits.map((unit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`h-[52px] flex items-center px-2 rounded border
              ${currentTime?.name === unit.name
                ? 'bg-primary/10 ring-1 ring-primary/20'
                : 'hover:bg-gray-50/80 ring-1 ring-gray-100'
              } transition-all duration-200`}
          >
            {/* 左侧时辰和时间 */}
            <div className="flex-1 mr-3">
              <div className={`text-sm ${currentTime?.name === unit.name ? 'font-medium text-primary' : 'text-gray-700'}`}>
                {unit.name}
              </div>
              <div className={`text-xs ${currentTime?.name === unit.name ? 'text-primary/70' : 'text-gray-400'}`}>
                {unit.period}
              </div>
            </div>

            {/* 右侧生肖圆环 */}
            <div className={`
              relative w-8 h-8 flex items-center justify-center
              ${currentTime?.name === unit.name ? 'text-primary' : 'text-gray-500'}
            `}>
              {/* 外圆环 */}
              <svg
                className={`absolute inset-0 w-full h-full ${
                  currentTime?.name === unit.name ? 'text-primary' : 'text-gray-200'
                }`}
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="11"
                  fill="none"
                  strokeWidth="1"
                  stroke="currentColor"
                  opacity="0.3"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="8"
                  fill="none"
                  strokeWidth="1"
                  stroke="currentColor"
                  opacity="0.5"
                />
              </svg>

              {/* 生肖文字 */}
              <span className={`
                relative z-10 text-sm font-medium
                transform transition-transform duration-200 hover:scale-110
                ${currentTime?.name === unit.name
                  ? 'text-primary'
                  : 'text-gray-600'
                }
              `}>
                {unit.zodiac}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 