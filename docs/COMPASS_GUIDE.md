# 罗盘与五行绘制指南

## 一、五行布局规范

### 1. 基本布局
- 五行元素按五角星形状布局
- 每个元素的角度：
  ```js
  const angles = {
    金: 0,    // 正西
    木: 72,   // 东
    水: 144,  // 北
    火: 216,  // 南
    土: 288   // 中
  }
  ```

### 2. 五行元素样式
- 中心圆直径：80px
- 外围元素直径：60px
- 连接线宽度：2px
- 颜色规范：
  ```js
  const colors = {
    金: '#FFD700',  // 金色
    木: '#90EE90',  // 绿色
    水: '#4169E1',  // 蓝色
    火: '#FF4500',  // 红色
    土: '#8B4513'   // 褐色
  }
  ```

### 3. 属性展示
- 每个五行元素周围均匀分布5个属性小球
- 小球直径：24px
- 分布半径：60px
- 角度间隔：72度（360/5）

## 二、罗盘布局规范

### 1. 基本结构
- 总直径：500px
- 同心圆层次：
  1. 五行层（最内层）：半径 40px
  2. 八卦层：半径 80px
  3. 地支层：半径 120px
  4. 天干层：半径 160px
  5. 二十四山：半径 200px

### 2. 元素布局
```typescript
interface CompassElement {
  text: string;
  degree: number;
  type: 'wuxing' | 'bagua' | 'dizhi' | 'tiangan' | 'direction' | 'star' | 'solarTerm';
  radius: number;
}
```

### 3. 八卦方位
```js
const baguaPositions = [
  { text: '乾', degree: 0 },   // 正北
  { text: '兑', degree: 45 },  // 东北
  { text: '离', degree: 90 },  // 正东
  { text: '震', degree: 135 }, // 东南
  { text: '巽', degree: 180 }, // 正南
  { text: '坎', degree: 225 }, // 西南
  { text: '艮', degree: 270 }, // 正西
  { text: '坤', degree: 315 }  // 西北
]
```

### 4. 样式规范
- 背景：`bg-neutral-50`
- 边框：`border-4 border-primary`
- 文字：
  - 五行：`text-primary-800`
  - 八卦：`text-primary-600`
  - 地支：`text-primary-500`
  - 天干：`text-primary-400`

### 5. 动画效果
- 旋转过渡：`transition-all duration-300`
- 指针样式：
  ```html
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-6 bg-primary-600" />
  ```

## 三、交互功能

### 1. 五行交互
- 点击元素显示详细信息
- 悬停效果：`hover:scale-110 transition-transform`
- 属性小球动画：`animate-bounce`

### 2. 罗盘交互
- 支持手动旋转
- 支持定位到特定方位
- 旋转动画：`transition-transform duration-500`

## 四、响应式设计

### 1. 移动端适配
```css
@media (max-width: 768px) {
  .compass-container {
    transform: scale(0.8);
  }
  .wuxing-container {
    transform: scale(0.9);
  }
}
```

### 2. 布局调整
- 小屏幕下五行元素间距缩小20%
- 罗盘整体缩放至适合屏幕大小

## 五、性能优化

### 1. 渲染优化
- 使用 `useMemo` 缓存计算结果
- 使用 `useCallback` 优化事件处理
- 使用 CSS transform 代替位置属性

### 2. 动画性能
- 使用 `transform` 进行动画
- 添加 `will-change` 属性
- 使用 `requestAnimationFrame` 处理复杂动画

## 六、代码示例

### 1. 计算元素位置
```typescript
const getElementPosition = (element: CompassElement) => {
  const radian = (element.degree - rotation) * Math.PI / 180;
  const x = element.radius * Math.cos(radian);
  const y = element.radius * Math.sin(radian);
  return { x, y };
};
```

### 2. 渲染五行属性
```typescript
const renderProperties = (element: WuxingElement) => {
  return element.properties.map((prop, index) => {
    const angle = index * (360 / 5);
    const radian = angle * Math.PI / 180;
    const x = 60 * Math.cos(radian);
    const y = 60 * Math.sin(radian);
    
    return (
      <div
        key={prop.name}
        className="absolute rounded-full bg-primary-100 text-primary-800"
        style={{
          transform: `translate(${x}px, ${y}px)`,
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {prop.name}
      </div>
    );
  });
};
```

## 七、注意事项

1. 确保所有角度计算使用弧度制
2. 注意性能优化，避免不必要的重渲染
3. 保持代码模块化，便于维护和扩展
4. 使用 TypeScript 类型定义确保类型安全
5. 注意动画性能，避免页面卡顿
6. 确保移动端的良好体验
7. 保持设计的一致性和美观性 