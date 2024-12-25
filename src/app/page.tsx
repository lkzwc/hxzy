'use client'
import { useEffect, useState } from 'react';
const { Solar, Lunar } = require('lunar-javascript');
import Sidebar from '@/components/Sidebar';

export default function Home() {
  const [lunarInfo, setLunarInfo] = useState({
    date: '',
    zodiac: '',
    ganzhi: '',
  });

  useEffect(() => {
    const lunar = Lunar.fromDate(new Date());
    setLunarInfo({
      date: `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
      zodiac: lunar.getYearShengXiao(),
      ganzhi: `${lunar.getYearInGanZhi()}年${lunar.getMonthInGanZhi()}月${lunar.getDayInGanZhi()}日`,
    });
  }, []);

  return (
    <div className="flex flex-col md:flex-row p-4 gap-4">
      <Sidebar />
      
      <div className="flex-1 space-y-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-primary text-xl font-bold mb-4 pb-2 border-b-2 border-secondary">
            当前农历
          </h2>
          <div className="space-y-2 text-text">
            <p className="flex justify-between">
              <span>农历：</span>
              <span className="font-medium">{lunarInfo.date}</span>
            </p>
            <p className="flex justify-between">
              <span>干支：</span>
              <span className="font-medium">{lunarInfo.ganzhi}</span>
            </p>
            <p className="flex justify-between">
              <span>生肖：</span>
              <span className="font-medium">{lunarInfo.zodiac}</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-primary text-xl font-bold mb-4 pb-2 border-b-2 border-secondary">
            今日养生建议
          </h2>
          <p className="text-text mb-4">根据当前节气，建议：</p>
          <ul className="space-y-2 text-text list-disc pl-6">
            <li>起居养生：顺应自然，早睡早起</li>
            <li>饮食调养：清淡为主，养生保健</li>
            <li>情志调摄：保持心情舒畅，切勿过度劳累</li>
          </ul>
        </div>
      </div>
    </div>
  );
}