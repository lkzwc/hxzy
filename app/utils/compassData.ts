export interface CompassElement {
  text: string;
  degree: number;
  type: 'wuxing' | 'bagua' | 'dizhi' | 'tiangan' | 'direction' | 'star' | 'solarTerm';
  radius: number;
}

export const WUXING_DATA: CompassElement[] = [
  { text: '金', degree: 0, type: 'wuxing', radius: 40 },
  { text: '木', degree: 72, type: 'wuxing', radius: 40 },
  { text: '水', degree: 144, type: 'wuxing', radius: 40 },
  { text: '火', degree: 216, type: 'wuxing', radius: 40 },
  { text: '土', degree: 288, type: 'wuxing', radius: 40 },
];

export const BAGUA_DATA: CompassElement[] = [
  { text: '乾', degree: 0, type: 'bagua', radius: 80 },
  { text: '兑', degree: 45, type: 'bagua', radius: 80 },
  { text: '离', degree: 90, type: 'bagua', radius: 80 },
  { text: '震', degree: 135, type: 'bagua', radius: 80 },
  { text: '巽', degree: 180, type: 'bagua', radius: 80 },
  { text: '坎', degree: 225, type: 'bagua', radius: 80 },
  { text: '艮', degree: 270, type: 'bagua', radius: 80 },
  { text: '坤', degree: 315, type: 'bagua', radius: 80 },
];

// ... 其他数据常量 