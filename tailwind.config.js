/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx,mdx}",  // 确保包含所有源文件
    ],
    theme: {
      extend: {
        colors: {
          primary: '#9B4722',    // 暖红褐色
          secondary: '#C17F59',  // 暖棕色
          background: '#FDF6E3', // 暖米色
          text: '#5C3A2E',       // 深褐色
        },
        fontFamily: {
          sans: ['"SimSun"', '"宋体"', 'serif'],
        },
      },
    },
    plugins: [],
  };