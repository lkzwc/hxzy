/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 主色调：中国红（传统中医文化的典雅红色）
        primary: {
          50: '#FFF5F5',
          100: '#FFE3E3',
          200: '#FFC7C7',
          300: '#FFA3A3',
          400: '#FF8585',
          500: '#D32F2F', // 主色：典雅的中国红
          600: '#B71C1C',
          700: '#901313',
          800: '#6B0D0D',
          900: '#4A0808',
          focus: '#B71C1C',
        },
        // 次要色调：赤金（传统而高贵）
        secondary: {
          50: '#FFF8F1',
          100: '#FEECDC',
          200: '#FCD9B8',
          300: '#FAC595',
          400: '#F8B171',
          500: '#C17B3A', // 次要色：温润的赤金
          600: '#A66431',
          700: '#8A4D28',
          800: '#6E361F',
          900: '#522016',
        },
        // 强调色：青玉（传统色彩中的点缀色）
        accent: {
          50: '#F3FAFA',
          100: '#E2F5F5',
          200: '#B7E9E9',
          300: '#8CDEDE',
          400: '#61D2D2',
          500: '#38A89D', // 强调色：清雅的青玉
          600: '#2C8C83',
          700: '#207067',
          800: '#14544C',
          900: '#083832',
        },
        // 中性色：暖灰（更温润的灰度）
        neutral: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
        // 补充色：胭脂（传统中医文化色）
        terra: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#E11D48',
          600: '#BE123C',
          700: '#9F1239',
          800: '#881337',
          900: '#4C0519',
        },
      },
      boxShadow: {
        'inner-sm': 'inset 0 1px 2px 0 rgb(0 0 0 / 0.05)',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#D32F2F",
          "primary-focus": "#B71C1C",
          secondary: "#C17B3A",
          "secondary-focus": "#A66431",
          accent: "#38A89D",
          "accent-focus": "#2C8C83",
          "base-100": "#FFFFFF",
          "base-200": "#FFF8F1",
          "base-300": "#FEECDC",
          neutral: "#44403C",
          "neutral-content": "#FFFFFF",
        },
      },
    ],
  },
} 