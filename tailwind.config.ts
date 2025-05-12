import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 基础颜色 - 中医暖色调
        primary: {
          DEFAULT: '#c17f46',  // 主色调默认值 - 中医药材棕色
          50: '#faf5f0',
          100: '#f5ebe1',
          200: '#ead7c3',
          300: '#e0c3a5',
          400: '#d5af87',
          500: '#c17f46',
          600: '#9a6638',
          700: '#744c2a',
          800: '#4d331c',
          900: '#27190e',
        },
        secondary: {
          DEFAULT: '#d35c38',  // 次要色默认值 - 朱砂红
          50: '#fcf1ee',
          100: '#f9e3dd',
          200: '#f3c7bb',
          300: '#edab99',
          400: '#e78f77',
          500: '#d35c38',
          600: '#a9492d',
          700: '#7f3722',
          800: '#552417',
          900: '#2a120b',
        },
        accent: {
          DEFAULT: '#e9c46a',  // 点缀色默认值 - 黄芪色
          50: '#fdf9f0',
          100: '#fbf3e1',
          200: '#f7e7c3',
          300: '#f3dba5',
          400: '#eecf87',
          500: '#e9c46a',
          600: '#ba9d55',
          700: '#8c7640',
          800: '#5d4e2a',
          900: '#2e2715',
        },
        neutral: {
          DEFAULT: '#b9aa9a',  // 中性色默认值 - 砂岩色
          50: '#f8f6f4',
          100: '#f1ede9',
          200: '#e3dbd3',
          300: '#d5c9bd',
          400: '#c7b7a7',
          500: '#b9aa9a',
          600: '#94887b',
          700: '#6f665c',
          800: '#4a443d',
          900: '#25221e',
        },
        // 背景色
        background: '#faf7f2',  // 淡米色背景
        foreground: '#3d2c1e',  // 深棕色文字
        muted: {
          DEFAULT: '#f5f0e8',
          foreground: '#6f665c',
        },
        popover: {
          DEFAULT: '#faf7f2',
          foreground: '#3d2c1e',
        },
        card: {
          DEFAULT: '#faf7f2',
          foreground: '#3d2c1e',
        },
        border: '#e3dbd3',
        input: '#e3dbd3',
        ring: '#c17f46',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

export default config