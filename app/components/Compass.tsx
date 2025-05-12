import { useEffect, useState } from 'react';

interface CompassElement {
  text: string;
  degree: number;
  type: 'wuxing' | 'bagua' | 'dizhi' | 'tiangan' | 'direction' | 'star' | 'solarTerm';
  radius: number;
}

const Compass = () => {
  const [rotation, setRotation] = useState(0);

  // 定义罗盘元素数据
  const compassData: CompassElement[] = [
    // 五行 - 最内圈
    { text: '金', degree: 0, type: 'wuxing', radius: 40 },
    { text: '木', degree: 72, type: 'wuxing', radius: 40 },
    { text: '水', degree: 144, type: 'wuxing', radius: 40 },
    { text: '火', degree: 216, type: 'wuxing', radius: 40 },
    { text: '土', degree: 288, type: 'wuxing', radius: 40 },
    
    // 八卦 - 第二圈
    { text: '乾', degree: 0, type: 'bagua', radius: 80 },
    { text: '兑', degree: 45, type: 'bagua', radius: 80 },
    { text: '离', degree: 90, type: 'bagua', radius: 80 },
    { text: '震', degree: 135, type: 'bagua', radius: 80 },
    { text: '巽', degree: 180, type: 'bagua', radius: 80 },
    { text: '坎', degree: 225, type: 'bagua', radius: 80 },
    { text: '艮', degree: 270, type: 'bagua', radius: 80 },
    { text: '坤', degree: 315, type: 'bagua', radius: 80 },
    
    // 十二地支 - 第三圈
    { text: '子', degree: 0, type: 'dizhi', radius: 120 },
    { text: '丑', degree: 30, type: 'dizhi', radius: 120 },
    { text: '寅', degree: 60, type: 'dizhi', radius: 120 },
    // ... 其他地支数据
  ];

  const getElementPosition = (element: CompassElement) => {
    const radian = (element.degree - rotation) * Math.PI / 180;
    const x = element.radius * Math.cos(radian);
    const y = element.radius * Math.sin(radian);
    return { x, y };
  };

  return (
    <div className="relative w-[500px] h-[500px] bg-slate-100 rounded-full border-4 border-amber-800">
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full"
        style={{ transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}
      >
        {compassData.map((element, index) => {
          const { x, y } = getElementPosition(element);
          return (
            <div
              key={index}
              className={`absolute text-lg font-bold transition-all duration-300
                ${element.type === 'wuxing' ? 'text-primary-800' : ''}
                ${element.type === 'bagua' ? 'text-primary-800' : ''}
                ${element.type === 'dizhi' ? 'text-green-800' : ''}`}
              style={{
                transform: `translate(${x + 250}px, ${y + 250}px) rotate(${-rotation}deg)`,
              }}
            >
              {element.text}
            </div>
          );
        })}
      </div>
      
      {/* 指针 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-6 bg-primary-600" />
    </div>
  );
};

export default Compass;