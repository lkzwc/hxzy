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
        // 中医药主题色彩 - 温润典雅，体现传统文化
        primary: {
          DEFAULT: '#b45309',  // 深褐色 - 中药材色，沉稳专业
          50: '#fefdf8',
          100: '#fef7ed',
          200: '#fde8d1',
          300: '#fbd4a5',
          400: '#f7b76d',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        secondary: {
          DEFAULT: '#166534',  // 深绿色 - 草药色，生机健康
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        accent: {
          DEFAULT: '#dc2626',  // 朱砂红 - 传统中医色，活力点缀
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        neutral: {
          DEFAULT: '#6b7280',  // 现代中性灰
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        // 背景和界面色彩
        background: '#ffffff',  // 纯白背景
        foreground: '#111827',  // 深灰文字
        muted: {
          DEFAULT: '#f3f4f6',
          foreground: '#6b7280',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#111827',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#111827',
        },
        border: '#e5e7eb',
        input: '#f3f4f6',
        ring: '#92400e',
        // 功能性颜色 - 中医主题
        success: '#166534',  // 深绿色 - 成功/健康
        warning: '#d97706',  // 琥珀色 - 警告/注意
        error: '#dc2626',    // 朱砂红 - 错误/危险
        info: '#92400e',     // 深褐色 - 信息/提示
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