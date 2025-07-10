'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
const { Solar, Lunar } = require('lunar-javascript');

// 十天干
const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
// 十二地支
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
// 十二宫
const PALACES = ['命宫', '兄弟', '夫妻', '子女', '财帛', '疾厄', '迁移', '交友', '官禄', '田宅', '福德', '父母'];
// 主星
const MAIN_STARS = ['紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'];
// 吉星
const LUCKY_STARS = ['文昌', '文曲', '左辅', '右弼', '天魁', '天钺'];
// 煞星
const UNLUCKY_STARS = ['擎羊', '陀罗', '火星', '铃星', '地空', '地劫'];
// 长生十二神
const LIFE_STARS = ['长生', '沐浴', '冠带', '临官', '帝旺', '衰', '病', '死', '墓', '绝', '胎', '养'];

interface BirthInfo {
  year: number;
  month: number;
  day: number;
  hour: string;
  minute: number;
  gender: 'male' | 'female';
}

interface PalaceInfo {
  name: string;
  mainStars: string[];
  luckyStars: string[];
  unluckyStars: string[];
  lifeStars: string[];
  earthlyBranch: string;
  heavenlyStem: string;
  description?: string;
  position?: { x: number; y: number };
  transformations?: string[];
  yearlyStars?: string[]; // Add type annotation
  flowStars?: string[]; // Add type annotation
}

// 星耀解读
const STAR_INTERPRETATIONS: { [key: string]: string } = {
  // 主星解读
  '紫微': '代表个人的尊贵、地位、权力和领导能力',
  '天机': '主管智慧、谋略、学习能力和创造力',
  '太阳': '象征权力、名誉、地位和事业成就',
  '武曲': '代表财运、管理能力和执行力',
  '天同': '主管人际关系、感情和艺术天赋',
  '廉贞': '象征清高、正直、独立和改革精神',
  '天府': '代表财富、福德和生活品质',
  '太阴': '主管情绪、直觉和艺术感受力',
  '贪狼': '象征进取心、欲望和异性缘',
  '巨门': '代表口才、社交能力和谈判技巧',
  '天相': '主管健康、人缘和贵人运',
  '天梁': '象征正直、名望和领导才能',
  '七杀': '代表权威、竞争力和独立性',
  '破军': '象征变革、创新和开拓精神',
  // 吉星解读
  '文昌': '主管学业、文艺才能和考试运',
  '文曲': '代表学术、文采和艺术天赋',
  '左辅': '象征助力、支持和贵人相助',
  '右弼': '代表辅助、合作和人际关系',
  '天魁': '主管贵人运和领导才能',
  '天钺': '象征权威和社会地位',
  // 煞星解读
  '擎羊': '代表固执、冲动和创新精神',
  '陀罗': '象征保守、稳重和执着',
  '火星': '主管冲突、竞争和动力',
  '铃星': '代表口舌是非和变动',
  '地空': '象征虚幻、理想和精神追求',
  '地劫': '主管波折、困境和突破'
};

// 宫位解读
const PALACE_INTERPRETATIONS: { [key: string]: string } = {
  '命宫': '代表个人的性格、外貌和人生格局',
  '兄弟': '主管兄弟姐妹关系、朋友和同事',
  '夫妻': '象征婚姻、感情和合作伙伴',
  '子女': '代表子女、创造力和事业成果',
  '财帛': '主管财运、收入和理财能力',
  '疾厄': '象征健康、疾病和困境',
  '迁移': '代表旅行、变动和海外发展',
  '交友': '主管社交圈、人际关系和群体活动',
  '官禄': '象征事业、地位和成就',
  '田宅': '代表房产、固定资产和居住环境',
  '福德': '主管心理、兴趣和精神生活',
  '父母': '象征长辈、贵人和人生指引'
};

// 长生十二神解读
const LIFE_STAR_INTERPRETATIONS: { [key: string]: string } = {
  '长生': '象征事物的开始，充满生机和潜力',
  '沐浴': '代表调整和净化的阶段',
  '冠带': '象征成长和初步成就',
  '临官': '代表事业达到顶峰',
  '帝旺': '象征最强盛的状态',
  '衰': '代表开始走下坡路',
  '病': '象征遇到困难和阻碍',
  '死': '代表低谷期',
  '墓': '象征潜伏和休养',
  '绝': '代表结束和转折',
  '胎': '象征新的开始在孕育',
  '养': '代表积蓄能量准备发展'
};

// 星耀组合解读
const STAR_COMBINATIONS: { [key: string]: string } = {
  '紫微天机': '智慧超群，思维敏捷，具有领导才能',
  '紫微破军': '权威果断，开创能力强，但易刚愎自用',
  '紫微天府': '富贵双全，地位尊崇',
  '天机巨门': '口才出众，善于表达，适合从事传媒工作',
  '天机文昌': '学习能力强，文笔优秀，适合学术研究',
  '太阳天梁': '正直威严，受人尊重，事业有成',
  '太阳武曲': '财运亨通，管理能力强',
  '武曲贪狼': '事业心强，善于理财，但易过于执着',
  '天同太阴': '艺术天赋高，感情丰富',
  '天府太阴': '富贵优雅，生活品质好',
  '左辅右弼': '贵人相助，人际关系好',
  '文昌文曲': '学识渊博，艺术才能出众'
};

// 流年运势解读
const YEARLY_FORTUNE: { [key: string]: { [key: string]: string } } = {
  '命宫': {
    '流年紫微': '今年个人发展顺利，容易得到领导赏识',
    '流年天机': '思维活跃，适合学习进修',
    '流年太阳': '有望升职加薪，社会地位提升',
    '流年武曲': '财运亨通，但需谨慎理财',
    '流年天同': '人际关系和谐，感情生活顺利',
    '流年天府': '生活质量提升，财运不错'
  },
  '财帛': {
    '流年紫微': '偏财运旺，可能有意外收获',
    '流年武曲': '正财运强，工作收入增加',
    '流年天府': '理财有道，可能有投资机会'
  },
  '官禄': {
    '流年紫微': '事业发展顺利，有升迁机会',
    '流年天机': '工作思路清晰，能得到赏识',
    '流年太阳': '贵人相助，事业有突破'
  }
};

interface YearlyFortune {
  year: number;
  stars: string[];
  interpretation: string;
}

export default function ZiWei() {
  const [birthInfo, setBirthInfo] = useState<BirthInfo>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    hour: '子',
    minute: new Date().getMinutes(),
    gender: 'male'
  });
  const [palaces, setPalaces] = useState<PalaceInfo[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [lunarDate, setLunarDate] = useState<any>(null);
  const [yearlyFortunes, setYearlyFortunes] = useState<YearlyFortune[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'circle'>('grid');

  // 时辰对应表
  const EARTHLY_BRANCH_HOURS: { [key: string]: string } = {
    '子': '23:00-01:00',
    '丑': '01:00-03:00',
    '寅': '03:00-05:00',
    '卯': '05:00-07:00',
    '辰': '07:00-09:00',
    '巳': '09:00-11:00',
    '午': '11:00-13:00',
    '未': '13:00-15:00',
    '申': '15:00-17:00',
    '酉': '17:00-19:00',
    '戌': '19:00-21:00',
    '亥': '21:00-23:00'
  };

  // 定义天干类型
  type TianGan = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';

  // 计算年干支
  const calculateYearGanZhi = (lunar: any) => {
    return {
      stem: lunar.getYearGan(),
      branch: lunar.getYearZhi()
    };
  };

  // 计算命宫位置
  const calculateDestinyPalace = (lunarMonth: number, hour: string) => {
    // 将农历月份转换为以寅月为首的月序
    const adjustedMonth = ((lunarMonth + 2) % 12) || 12;
    
    // 获取时辰序号（子时为1）
    const hourIndex = EARTHLY_BRANCHES.indexOf(hour) + 1;
    
    // 计算命宫地支序号
    const index = (12 - ((adjustedMonth + hourIndex - 1) % 12)) || 12;
    
    // 因为地支数组是从子开始的，所以需要减1来获取正确的索引
    const arrayIndex = (index - 1 + 12) % 12;
    
    return EARTHLY_BRANCHES[arrayIndex];
  };

  // 计算身宫位置
  const calculateBodyPalace = (destinyBranch: string) => {
    const destinyIndex = EARTHLY_BRANCHES.indexOf(destinyBranch);
    // 身宫在命宫对宫，相隔六个地支
    return EARTHLY_BRANCHES[(destinyIndex + 6) % 12];
  };

  // 计算紫微星位置
  const calculateZiWeiPosition = (lunarDay: number, yearStem: TianGan) => {
    // 紫微星落宫计算表（简化版，实际应该使用更详细的对照表）
    const ziWeiTable: Record<TianGan, number> = {
      甲: 0, 己: 0,  // 第一组
      乙: 1, 庚: 1,  // 第二组
      丙: 2, 辛: 2,  // 第三组
      丁: 3, 壬: 3,  // 第四组
      戊: 4, 癸: 4   // 第五组
    };

    // 根据日数定位基础位置
    let basePosition = Math.floor((lunarDay - 1) / 3) % 12;
    
    // 根据年干调整位置
    const adjustment = ziWeiTable[yearStem] || 0;
    
    // 计算最终位置
    return EARTHLY_BRANCHES[(basePosition + adjustment) % 12];
  };

  // 计算天府星位置
  const calculateTianFuPosition = (ziWeiPosition: string) => {
    const ziWeiIndex = EARTHLY_BRANCHES.indexOf(ziWeiPosition);
    // 天府星与紫微星相对位置固定，在地支上相差7位
    return EARTHLY_BRANCHES[(ziWeiIndex + 7) % 12];
  };

  // 计算其他主星
  const calculateMainStars = (ziWeiPosition: string, tianFuPosition: string, yearStem: TianGan) => {
    const stars: { [key: string]: string } = {};
    const ziWeiIndex = EARTHLY_BRANCHES.indexOf(ziWeiPosition);
    const tianFuIndex = EARTHLY_BRANCHES.indexOf(tianFuPosition);
    
    // 紫微系
    stars['紫微'] = ziWeiPosition;
    stars['天机'] = EARTHLY_BRANCHES[(ziWeiIndex + 1) % 12];
    stars['太阳'] = EARTHLY_BRANCHES[(ziWeiIndex + 3) % 12];
    stars['武曲'] = EARTHLY_BRANCHES[(ziWeiIndex + 4) % 12];
    stars['天同'] = EARTHLY_BRANCHES[(ziWeiIndex + 5) % 12];
    stars['廉贞'] = EARTHLY_BRANCHES[(ziWeiIndex + 8) % 12];
    
    // 天府系
    stars['天府'] = tianFuPosition;
    stars['太阴'] = EARTHLY_BRANCHES[(tianFuIndex + 1) % 12];
    stars['贪狼'] = EARTHLY_BRANCHES[(tianFuIndex + 2) % 12];
    stars['巨门'] = EARTHLY_BRANCHES[(tianFuIndex + 3) % 12];
    stars['天相'] = EARTHLY_BRANCHES[(tianFuIndex + 4) % 12];
    stars['天梁'] = EARTHLY_BRANCHES[(tianFuIndex + 5) % 12];
    stars['七杀'] = EARTHLY_BRANCHES[(tianFuIndex + 6) % 12];
    stars['破军'] = EARTHLY_BRANCHES[(tianFuIndex + 7) % 12];
    
    return stars;
  };

  // 计算六吉星
  const calculateLuckyStars = (yearBranch: string, monthBranch: string) => {
    const stars: { [key: string]: string } = {};
    const yearIndex = EARTHLY_BRANCHES.indexOf(yearBranch);
    const monthIndex = EARTHLY_BRANCHES.indexOf(monthBranch);

    // 文昌位置
    stars['文昌'] = EARTHLY_BRANCHES[(yearIndex + 4) % 12];
    // 文曲位置
    stars['文曲'] = EARTHLY_BRANCHES[(yearIndex + 8) % 12];
    // 左辅位置
    stars['左辅'] = EARTHLY_BRANCHES[(monthIndex + 1) % 12];
    // 右弼位置
    stars['右弼'] = EARTHLY_BRANCHES[(monthIndex + 11) % 12];
    
    return stars;
  };

  // 计算六煞星
  const calculateUnluckyStars = (yearBranch: string, monthBranch: string) => {
    const stars: { [key: string]: string } = {};
    const yearIndex = EARTHLY_BRANCHES.indexOf(yearBranch);
    const monthIndex = EARTHLY_BRANCHES.indexOf(monthBranch);

    // 擎羊
    stars['擎羊'] = EARTHLY_BRANCHES[(yearIndex + 3) % 12];
    // 陀罗
    stars['陀罗'] = EARTHLY_BRANCHES[(yearIndex + 9) % 12];
    // 火星
    stars['火星'] = EARTHLY_BRANCHES[(monthIndex + 2) % 12];
    // 铃星
    stars['铃星'] = EARTHLY_BRANCHES[(monthIndex + 10) % 12];
    
    return stars;
  };

  // 计算长生十二神
  const calculateLifeStars = (yearStem: TianGan, gender: 'male' | 'female') => {
    const stemIndex = HEAVENLY_STEMS.indexOf(yearStem);
    let baseIndex = 0;

    // 根据天干和性别确定起始宫位
    if (['甲', '己'].includes(yearStem)) {
      baseIndex = EARTHLY_BRANCHES.indexOf(gender === 'male' ? '寅' : '申');
    } else if (['乙', '庚'].includes(yearStem)) {
      baseIndex = EARTHLY_BRANCHES.indexOf(gender === 'male' ? '卯' : '酉');
    } else if (['丙', '辛'].includes(yearStem)) {
      baseIndex = EARTHLY_BRANCHES.indexOf(gender === 'male' ? '巳' : '亥');
    } else if (['丁', '壬'].includes(yearStem)) {
      baseIndex = EARTHLY_BRANCHES.indexOf(gender === 'male' ? '午' : '子');
    } else { // 戊、癸
      baseIndex = EARTHLY_BRANCHES.indexOf(gender === 'male' ? '巳' : '亥');
    }

    const stars: { [key: string]: string } = {};
    LIFE_STARS.forEach((star, index) => {
      stars[star] = EARTHLY_BRANCHES[(baseIndex + index) % 12];
    });

    return stars;
  };

  // 计算星耀组合
  const findStarCombinations = (stars: string[]): string[] => {
    const combinations: string[] = [];
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const combo = stars[i] + stars[j];
        const reverseCombo = stars[j] + stars[i];
        if (STAR_COMBINATIONS[combo]) {
          combinations.push(combo);
        } else if (STAR_COMBINATIONS[reverseCombo]) {
          combinations.push(reverseCombo);
        }
      }
    }
    return combinations;
  };

  // 计算流年运势
  const calculateYearlyFortune = (currentYear: number) => {
    const fortunes: YearlyFortune[] = [];
    for (let year = currentYear; year <= currentYear + 10; year++) {
      const yearStars = ['流年紫微', '流年天机', '流年太阳']; // 简化示例，实际应该根据流年计算
      const interpretation = yearStars
        .map(star => YEARLY_FORTUNE['命宫'][star] || '')
        .filter(Boolean)
        .join('；');
      
      fortunes.push({
        year,
        stars: yearStars,
        interpretation
      });
    }
    return fortunes;
  };

  // 大限年限计算
  const calculateDaXian = (birthYear: number, gender: 'male' | 'female'): { [key: string]: number[] } => {
    const startAge = gender === 'male' ? 1 : 2;
    const daxian: { [key: string]: number[] } = {};
    
    EARTHLY_BRANCHES.forEach((branch, index) => {
      const startYear = birthYear + startAge + index * 10;
      daxian[branch] = Array.from({ length: 10 }, (_, i) => startYear + i);
    });
    
    return daxian;
  };

  // 获取当前大限
  const getCurrentDaXian = (birthYear: number, currentYear: number, gender: 'male' | 'female'): string => {
    const age = currentYear - birthYear;
    const period = Math.floor((age - (gender === 'male' ? 1 : 2)) / 10);
    return EARTHLY_BRANCHES[period % 12];
  };

  // 渲染单个宫位的内容
  const renderPalace = (palace: PalaceInfo, auxiliaryStars: number[]) => (
    <div className={`h-full flex flex-col border ${palace.name === '命宫' ? 'border-red-800 bg-red-50' : 'border-gray-300'} rounded-lg p-2`}>
      <div className={`palace-header flex justify-between items-center pb-1 mb-1 border-b ${palace.name === '命宫' ? 'border-red-300' : 'border-gray-200'}`}>
        <span className={`text-base font-bold ${palace.name === '命宫' ? 'text-red-800' : 'text-gray-800'}`}>
          {palace.name}
        </span>
        <span className="text-sm text-gray-600">
          {palace.earthlyBranch}
        </span>
      </div>
      
      <div className="flex-1 flex flex-col gap-1 text-xs">
        {/* 星耀分组 */}
        <div className="flex-1 grid grid-cols-2 gap-x-1">
          {/* 左侧：主星、辅星、四化 */}
          <div className="space-y-1">
            {/* 主星 */}
            {palace.mainStars.length > 0 && (
              <div className="border border-purple-100 rounded bg-purple-50/50">
                <div className="text-purple-500 border-b border-purple-100 px-1 py-0.5">主星</div>
                <div className="text-purple-700 font-medium leading-normal px-1 py-0.5">
                  {palace.mainStars.map((star, index) => (
                    <div key={index}>
                      {star}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 辅星 */}
            {palace.luckyStars.length > 0 && (
              <div className="border border-green-100 rounded bg-green-50/50">
                <div className="text-green-500 border-b border-green-100 px-1 py-0.5">辅星</div>
                <div className="text-green-700 leading-normal px-1 py-0.5">
                  {palace.luckyStars.map((star, index) => (
                    <div key={index}>
                      {star}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 四化 */}
            {palace.transformations && palace.transformations.length > 0 && (
              <div className="border border-pink-100 rounded bg-pink-50/50">
                <div className="text-pink-500 border-b border-pink-100 px-1 py-0.5">四化</div>
                <div className="text-pink-700 leading-normal px-1 py-0.5">
                  {palace.transformations.map((trans, index) => (
                    <div key={index}>
                      {trans}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 右侧：杂耀、神煞 */}
          <div className="space-y-1">
            {/* 杂耀 */}
            {palace.unluckyStars.length > 0 && (
              <div className="border border-orange-100 rounded bg-orange-50/50">
                <div className="text-orange-500 border-b border-orange-100 px-1 py-0.5">杂耀</div>
                <div className="text-orange-700 leading-normal px-1 py-0.5">
                  {palace.unluckyStars.map((star, index) => (
                    <div key={index}>
                      {star}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 神煞 */}
            {palace.lifeStars.length > 0 && (
              <div className="border border-amber-100 rounded bg-amber-50/50">
                <div className="text-primary border-b border-amber-100 px-1 py-0.5">神煞</div>
                <div className="text-primary-700 leading-normal px-1 py-0.5">
                  {palace.lifeStars.map((star, index) => (
                    <div key={index}>
                      {star}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 底部：小限和流耀 */}
        {Boolean(palace?.yearlyStars?.length || palace?.flowStars?.length) && (
          <div className="grid grid-cols-2 gap-x-1">
            {Boolean(palace?.yearlyStars?.length) && (
              <div className="border border-indigo-100 rounded bg-indigo-50/50">
                <div className="text-indigo-500 border-b border-indigo-100 px-1 py-0.5">小限</div>
                <div className="text-indigo-700 leading-normal px-1 py-0.5">
                  {palace.yearlyStars?.map((star, index) => (
                    <div key={index}>{star}</div>
                  ))}
                </div>
              </div>
            )}
            {Boolean(palace?.flowStars?.length) && (
              <div className="border border-teal-100 rounded bg-teal-50/50">
                <div className="text-teal-500 border-b border-teal-100 px-1 py-0.5">流耀</div>
                <div className="text-teal-700 leading-normal px-1 py-0.5">
                  {palace.flowStars?.map((star, index) => (
                    <div key={index}>{star}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 大限年份 - 始终显示在最底部 */}
        {auxiliaryStars && (
          <div className="pt-0.5 mt-auto border-t border-gray-200">
            <div className="text-gray-500">大限：<span className="text-gray-600">{auxiliaryStars[0]}-{auxiliaryStars[9]}</span></div>
          </div>
        )}
      </div>
    </div>
  );

  // 圆形命盘渲染组件
  const CircleChart = ({ palaces }: { palaces: PalaceInfo[] }) => {
    const daxian = calculateDaXian(birthInfo.year, birthInfo.gender);
    const currentDaXian = getCurrentDaXian(birthInfo.year, new Date().getFullYear(), birthInfo.gender);

    return (
      <div className="w-full max-w-[1200px] mx-auto p-4">
        <div className="relative bg-gray-50 rounded-xl shadow-lg p-4">
          <div className="grid grid-cols-4 gap-2">
            {/* 第一行 */}
            <div className="aspect-square">
              {renderPalace(palaces[7], daxian[palaces[7].earthlyBranch])}
            </div>
            <div className="aspect-square">
              {renderPalace(palaces[6], daxian[palaces[6].earthlyBranch])}
            </div>
            <div className="aspect-square">
              {renderPalace(palaces[5], daxian[palaces[5].earthlyBranch])}
            </div>
            <div className="aspect-square">
              {renderPalace(palaces[4], daxian[palaces[4].earthlyBranch])}
            </div>

            {/* 第二行 */}
            <div className="aspect-square">
              {renderPalace(palaces[8], daxian[palaces[8].earthlyBranch])}
            </div>
            <div className="col-span-2 row-span-2 bg-white rounded-lg border border-gray-200 p-2">
              <div className="h-full flex flex-col justify-center items-center space-y-2 text-xs">
                <div className="text-lg font-bold text-gray-800">中宫</div>
                {lunarDate && (
                  <div className="text-gray-600 text-center">
                    <div className="font-medium">
                      农历：{lunarDate.getYearInChinese()}年{lunarDate.getMonthInChinese()}月{lunarDate.getDayInChinese()}
                    </div>
                    <div>{lunarDate.getYearInGanZhi()}年</div>
                    <div>{lunarDate.getMonthInGanZhi()}月</div>
                    <div>{lunarDate.getDayInGanZhi()}日</div>
                    <div className="mt-2 text-red-800">
                      当前大限：{currentDaXian}宫
                      <div>({daxian[currentDaXian]?.[0]}-{daxian[currentDaXian]?.[9]}岁)</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="aspect-square">
              {renderPalace(palaces[3], daxian[palaces[3].earthlyBranch])}
            </div>

            {/* 第三行 */}
            <div className="aspect-square">
              {renderPalace(palaces[9], daxian[palaces[9].earthlyBranch])}
            </div>
            <div className="aspect-square">
              {renderPalace(palaces[2], daxian[palaces[2].earthlyBranch])}
            </div>

            {/* 第四行 */}
            <div className="aspect-square">
              {renderPalace(palaces[10], daxian[palaces[10].earthlyBranch])}
            </div>
            <div className="aspect-square">
              {renderPalace(palaces[11], daxian[palaces[11].earthlyBranch])}
            </div>
            <div className="aspect-square">
              {renderPalace(palaces[0], daxian[palaces[0].earthlyBranch])}
            </div>
            <div className="aspect-square">
              {renderPalace(palaces[1], daxian[palaces[1].earthlyBranch])}
            </div>
          </div>
        </div>

        {/* 图例说明 */}
        <div className="mt-4 bg-white rounded-lg shadow p-2">
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-purple-700">●</span> 主星
              <span className="text-green-700 ml-2">●</span> 辅星
            </div>
            <div>
              <span className="text-orange-700">●</span> 杂耀
              <span className="text-primary-700 ml-2">●</span> 神煞
            </div>
            <div>
              <span className="text-pink-700">●</span> 四化
              <span className="text-indigo-700 ml-2">●</span> 小限
            </div>
            <div>
              <span className="text-teal-700">●</span> 流耀
              <span className="text-gray-600 ml-2">●</span> 大限
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 获取农历日期
    const solar = Solar.fromYmd(birthInfo.year, birthInfo.month, birthInfo.day);
    const lunar = solar.getLunar();
    setLunarDate(lunar);
    
    const yearGanZhi = calculateYearGanZhi(lunar);
    
    // 计算命宫
    const destinyPalace = calculateDestinyPalace(lunar.getMonth(), birthInfo.hour);
    const destinyPalaceIndex = EARTHLY_BRANCHES.indexOf(destinyPalace);
    
    // 计算身宫
    const bodyPalace = calculateBodyPalace(destinyPalace);
    
    // 计算紫微星位置
    const ziWeiPosition = calculateZiWeiPosition(lunar.getDay(), yearGanZhi.stem);
    
    // 计算天府星位置
    const tianFuPosition = calculateTianFuPosition(ziWeiPosition);
    
    // 计算主星
    const mainStars = calculateMainStars(ziWeiPosition, tianFuPosition, yearGanZhi.stem);
    
    // 计算吉星
    const luckyStars = calculateLuckyStars(yearGanZhi.branch, lunar.getMonthZhi());
    
    // 计算煞星
    const unluckyStars = calculateUnluckyStars(yearGanZhi.branch, lunar.getMonthZhi());
    
    // 计算长生十二神
    const lifeStars = calculateLifeStars(yearGanZhi.stem, birthInfo.gender);
    
    // 生成十二宫数据
    const newPalaces: PalaceInfo[] = PALACES.map((palace, index) => {
      const branch = EARTHLY_BRANCHES[index];
      return {
        name: palace,
        earthlyBranch: branch,
        heavenlyStem: yearGanZhi.stem,
        mainStars: Object.entries(mainStars)
          .filter(([_, pos]) => pos === branch)
          .map(([star]) => star),
        luckyStars: Object.entries(luckyStars)
          .filter(([_, pos]) => pos === branch)
          .map(([star]) => star),
        unluckyStars: Object.entries(unluckyStars)
          .filter(([_, pos]) => pos === branch)
          .map(([star]) => star),
        lifeStars: Object.entries(lifeStars)
          .filter(([_, pos]) => pos === branch)
          .map(([star]) => star),
      };
    });
    
    // 计算流年运势
    const fortunes = calculateYearlyFortune(birthInfo.year);
    setYearlyFortunes(fortunes);
    
    setPalaces(newPalaces);
    
    setShowResult(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 min-h-screen bg-gradient-to-b from-amber-50 to-amber-100"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-2 text-amber-800 font-serif">紫薇斗数排盘</h2>
          <p className="text-gray-600 italic">推算天机，洞察命理</p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-amber-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">年份</label>
                <input
                  type="number"
                  value={birthInfo.year}
                  onChange={(e) => setBirthInfo({ ...birthInfo, year: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-amber-200 rounded-md shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">月份</label>
                <select
                  value={birthInfo.month}
                  onChange={(e) => setBirthInfo({ ...birthInfo, month: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-amber-200 rounded-md shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i + 1}>{i + 1}月</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">日期</label>
                <select
                  value={birthInfo.day}
                  onChange={(e) => setBirthInfo({ ...birthInfo, day: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-amber-200 rounded-md shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50"
                >
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i} value={i + 1}>{i + 1}日</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">时辰</label>
                <select
                  value={birthInfo.hour}
                  onChange={(e) => setBirthInfo({ ...birthInfo, hour: e.target.value })}
                  className="w-full px-3 py-2 border border-amber-200 rounded-md shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50"
                >
                  {EARTHLY_BRANCHES.map(branch => (
                    <option key={branch} value={branch}>
                      {branch}时 ({EARTHLY_BRANCH_HOURS[branch]})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">性别：</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="male"
                    checked={birthInfo.gender === 'male'}
                    onChange={(e) => setBirthInfo({ ...birthInfo, gender: e.target.value as 'male' | 'female' })}
                    className="form-radio h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2">男</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="female"
                    checked={birthInfo.gender === 'female'}
                    onChange={(e) => setBirthInfo({ ...birthInfo, gender: e.target.value as 'male' | 'female' })}
                    className="form-radio h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2">女</span>
                </label>
              </div>
            </div>

            {/* {lunarDate && (
              <div className="text-center space-y-2 text-gray-600">
                <div>
                  农历：{lunarDate.getYearInChinese()}年 {lunarDate.getMonthInChinese()}月 {lunarDate.getDayInChinese()}
                </div>
                <div>
                  {lunarDate.getYearInGanZhi()}年 {lunarDate.getMonthInGanZhi()}月 {lunarDate.getDayInGanZhi()}日
                </div>
                <div>
                  节气：{lunarDate.getJieQi()}
                </div>
                <div>
                  星期{lunarDate.getWeekInChinese()}
                </div>
                {lunarDate.getFestivals().length > 0 && (
                  <div>
                    节日：{lunarDate.getFestivals().join('、')}
                  </div>
                )}
              </div>
            )}
             */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors duration-200 font-medium text-lg shadow-md hover:shadow-lg"
            >
              推算命盘
            </button>
          </form>
        </div>

        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 space-y-8"
          >
            {/* 命盘显示 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-amber-200">
              <h3 className="text-2xl font-bold text-center mb-6 text-amber-800">命盘</h3>
              <CircleChart palaces={palaces} />
            </div>

            {/* 星耀组合解读 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-amber-200">
              <h3 className="text-2xl font-bold text-center mb-6 text-amber-800">星耀组合解读</h3>
              <div className="space-y-4">
                {palaces.map((palace, index) => {
                  const combinations = findStarCombinations([
                    ...palace.mainStars,
                    ...palace.luckyStars
                  ]);
                  
                  if (combinations.length === 0) return null;

                  return (
                    <div key={index} className="border-b border-amber-200 pb-4 last:border-0">
                      <h4 className="text-lg font-bold text-amber-800 mb-2">
                        {palace.name}宫星耀组合
                      </h4>
                      <ul className="list-disc list-inside space-y-2">
                        {combinations.map((combo, idx) => (
                          <li key={idx} className="text-gray-700">
                            {combo}：{STAR_COMBINATIONS[combo]}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 流年运势分析 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-amber-200">
              <h3 className="text-2xl font-bold text-center mb-6 text-amber-800">流年运势分析</h3>
              <div className="space-y-4">
                {yearlyFortunes.map((fortune, index) => (
                  <div key={index} className="border-b border-amber-200 pb-4 last:border-0">
                    <h4 className="text-lg font-bold text-amber-800 mb-2">
                      {fortune.year}年运势
                    </h4>
                    <p className="text-gray-700">{fortune.interpretation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 命盘解读 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-amber-200">
              <h3 className="text-2xl font-bold text-center mb-6 text-amber-800">命盘解读</h3>
              <div className="space-y-6">
                {palaces.map((palace, index) => {
                  const hasStars = palace.mainStars.length > 0 || 
                                 palace.luckyStars.length > 0 || 
                                 palace.unluckyStars.length > 0 || 
                                 palace.lifeStars.length > 0;
                  
                  if (!hasStars) return null;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-amber-200 pb-4 last:border-0"
                    >
                      <h4 className="text-lg font-bold text-amber-800 mb-2">
                        {palace.name}宫 ({palace.earthlyBranch})
                      </h4>
                      <div className="text-gray-700">
                        <p className="mb-2 italic">{PALACE_INTERPRETATIONS[palace.name]}</p>
                        <div className="space-y-2">
                          {palace.mainStars.length > 0 && (
                            <div>
                              <span className="text-purple-600 font-medium">主星解读：</span>
                              <ul className="list-disc list-inside ml-4">
                                {palace.mainStars.map((star, idx) => (
                                  <li key={idx}>{star}：{STAR_INTERPRETATIONS[star]}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {palace.luckyStars.length > 0 && (
                            <div>
                              <span className="text-green-600 font-medium">吉星解读：</span>
                              <ul className="list-disc list-inside ml-4">
                                {palace.luckyStars.map((star, idx) => (
                                  <li key={idx}>{star}：{STAR_INTERPRETATIONS[star]}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {palace.unluckyStars.length > 0 && (
                            <div>
                              <span className="text-red-600 font-medium">煞星解读：</span>
                              <ul className="list-disc list-inside ml-4">
                                {palace.unluckyStars.map((star, idx) => (
                                  <li key={idx}>{star}：{STAR_INTERPRETATIONS[star]}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {palace.lifeStars.length > 0 && (
                            <div>
                              <span className="text-primary-600 font-medium">长生解读：</span>
                              <ul className="list-disc list-inside ml-4">
                                {palace.lifeStars.map((star, idx) => (
                                  <li key={idx}>{star}：{LIFE_STAR_INTERPRETATIONS[star]}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
