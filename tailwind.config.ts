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
        // 基础颜色
        primary: {
          DEFAULT: '#40b9af',  // 主色调默认值
          50: '#f0f9f8',
          100: '#d9f1ef',
          200: '#b3e3df',
          300: '#8cd5cf',
          400: '#66c7bf',
          500: '#40b9af',
          600: '#33948c',
          700: '#266f69',
          800: '#1a4a46',
          900: '#0d2523',
        },
        secondary: {
          DEFAULT: '#f56b6b',  // 次要色默认值
          50: '#fef2f2',
          100: '#fde6e6',
          200: '#fbd0d0',
          300: '#f9b3b3',
          400: '#f78f8f',
          500: '#f56b6b',
          600: '#c45656',
          700: '#934040',
          800: '#622b2b',
          900: '#311515',
        },
        accent: {
          DEFAULT: '#f5d88a',  // 点缀色默认值
          50: '#fefbf3',
          100: '#fdf7e7',
          200: '#fbf0d2',
          300: '#f9e8ba',
          400: '#f7e0a2',
          500: '#f5d88a',
          600: '#c4ad6e',
          700: '#938253',
          800: '#625637',
          900: '#312b1c',
        },
        neutral: {
          DEFAULT: '#aab9b9',  // 中性色默认值
          50: '#f7f8f8',
          100: '#eef1f1',
          200: '#dde3e3',
          300: '#ccd5d5',
          400: '#bbc7c7',
          500: '#aab9b9',
          600: '#889494',
          700: '#666f6f',
          800: '#444a4a',
          900: '#222525',
        },
        // 背景色
        background: '#ffffff',  // 白色背景
        foreground: '#222525',  // 深色文字
        muted: {
          DEFAULT: '#f7f8f8',
          foreground: '#666f6f',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#222525',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#222525',
        },
        border: '#dde3e3',
        input: '#dde3e3',
        ring: '#40b9af',
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