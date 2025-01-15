'use client'
import { useState, useEffect } from 'react';
const {Solar, Lunar, HolidayUtil} = require('lunar-javascript')
import { motion, AnimatePresence } from 'framer-motion';

// 定义时辰类型
interface TimeUnit {
  name: string;
  period: string;
  zodiac: string;
}

// 十二时辰数据
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
const getCurrentTimeUnit = () => {
  const now = new Date();
  const hour = now.getHours();
  const index = Math.floor(((hour + 1) % 24) / 2);
  return timeUnits[index];
};

// 时辰对应的地支
const timeToEarthBranch: Record<string, string> = {
  '子时': '子',
  '丑时': '丑',
  '寅时': '寅',
  '卯时': '卯',
  '辰时': '辰',
  '巳时': '巳',
  '午时': '午',
  '未时': '未',
  '申时': '申',
  '酉时': '酉',
  '戌时': '戌',
  '亥时': '亥',
};

// 六壬数组
const liuRenArray = ["大安", "流连", "速喜", "赤口", "小吉", "空亡"] as const;
type LiuRen = typeof liuRenArray[number];

interface DivinationResult {
  result: LiuRen;
  interpretation: string;
  timeframe: string;
  advice: string;
}

// 结果解释
const resultInterpretations: Record<LiuRen, { interpretation: string; timeframe: string; advice: string }> = {
  "大安": {
    interpretation: "大吉大顺，诸事顺遂",
    timeframe: "约一周之内可见分晓",
    advice: "可以大胆行事，吉利可期"
  },
  "流连": {
    interpretation: "事情有反复，需要耐心等待",
    timeframe: "可能需要两周或更长时间",
    advice: "保持耐心，适时而动"
  },
  "速喜": {
    interpretation: "喜事将至，但不宜过分乐观",
    timeframe: "三天之内有结果",
    advice: "把握机会，谨慎行事"
  },
  "赤口": {
    interpretation: "易生口舌是非，需要谨慎",
    timeframe: "一周内需要特别注意",
    advice: "谨言慎行，避免冲突"
  },
  "小吉": {
    interpretation: "小有所成，但不宜大动",
    timeframe: "近期内会有小收获",
    advice: "循序渐进，稳中求进"
  },
  "空亡": {
    interpretation: "事情难成，诸事不顺",
    timeframe: "近期不宜有大动作",
    advice: "暂缓行事，等待时机"
  }
};

export default function LiuRen() {
  const [lunarInfo, setLunarInfo] = useState({
    date: '',
    ganzhi: '',
    zodiac: '',
  });
  const [divinationResult, setDivinationResult] = useState<DivinationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const lunar = Lunar.fromDate(new Date());
    setLunarInfo({
      date: `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
      ganzhi: `${lunar.getYearInGanZhi()}年${lunar.getMonthInGanZhi()}月${lunar.getDayInGanZhi()}日`,
      zodiac: lunar.getYearShengXiao(),
    });
  }, []);

  const calculateLiuRen = (lunarMonth: number, lunarDay: number, currentTime: string): LiuRen => {
    // 1. 从月份开始推算（月份从1开始）
    let monthIndex = ((lunarMonth - 1) % 6 + 6) % 6;
    let currentPosition = liuRenArray[monthIndex];
    
    // 2. 从当前位置续计算日期（日期从1开始）
    let daySteps = ((lunarDay - 1) % 6 + 6) % 6;
    let dayIndex = (monthIndex + daySteps) % 6;
    currentPosition = liuRenArray[dayIndex];
    
    // 3. 从日期位置继续计算时辰
    const earthBranch = timeToEarthBranch[currentTime];
    const earthBranchIndex = "子丑寅卯辰巳午未申酉戌亥".indexOf(earthBranch);
    let timeSteps = (earthBranchIndex % 6 + 6) % 6;
    let finalIndex = (dayIndex + timeSteps) % 6;
    
    return liuRenArray[finalIndex];
  };

  const performDivination = async () => {
    setIsCalculating(true);
    
    // 获取当前农历日期和时辰
    const lunar = Lunar.fromDate(new Date());
    const month = lunar.getMonth(); // 直接获取月份数字
    const day = lunar.getDay(); // 直接获取日期数字
    const currentTime = getCurrentTimeUnit().name;
    
    // 模拟计算延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 计算结果
    const result = calculateLiuRen(month, day, currentTime);
    
    // 确保结果是六壬数组中的一个
    if (liuRenArray.includes(result)) {
      setDivinationResult({
        result,
        ...resultInterpretations[result]
      });
    } else {
      // 如果计算结果不在预期范围内，使用默认值
      setDivinationResult({
        result: "大安",
        ...resultInterpretations["大安"]
      });
    }
    
    setIsCalculating(false);
  };

  return (
    <div className="space-y-8">
      {/* 农历信息卡片 */}
      <div className="space-y-4 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-primary pb-2 border-b border-gray-200">
          当前历法
        </h2>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-3">
            <p className="flex justify-between items-center text-lg">
              <span className="text-gray-500">农历：</span>
              <span className="font-medium text-primary">{lunarInfo.date}</span>
            </p>
            <p className="flex justify-between items-center text-lg">
              <span className="text-gray-500">干支：</span>
              <span className="font-medium text-primary">{lunarInfo.ganzhi}</span>
            </p>
            <p className="flex justify-between items-center text-lg">
              <span className="text-gray-500">生肖：</span>
              <span className="font-medium text-primary">{lunarInfo.zodiac}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 占卜区域 */}
      <div className="space-y-4 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-primary pb-2 border-b border-gray-200">
          小六壬占卜
        </h2>
        <p className="text-gray-600">
          小六壬是一种简便的占卜方法，可以预测事情吉凶。选择一个问题，点击下方按钮开始占卜。
        </p>
        <button
          onClick={performDivination}
          disabled={isCalculating}
          className={`w-full py-3 bg-primary text-white rounded-md transition-colors
            ${isCalculating ? 'opacity-50' : 'hover:bg-primary/90'}`}
        >
          {isCalculating ? '推算中...' : '开始占卜'}
        </button>

        <AnimatePresence mode="wait">
          {divinationResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 p-4 bg-primary/5 rounded-lg"
            >
              <h3 className="text-lg font-bold text-primary mb-4">
                占卜结果：{divinationResult.result}
              </h3>
              <div className="space-y-3 text-gray-600">
                <p>
                  <span className="font-medium text-primary">解释：</span>
                  {divinationResult.interpretation}
                </p>
                <p>
                  <span className="font-medium text-primary">时效：</span>
                  {divinationResult.timeframe}
                </p>
                <p>
                  <span className="font-medium text-primary">建议：</span>
                  {divinationResult.advice}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}