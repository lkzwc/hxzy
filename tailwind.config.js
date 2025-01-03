/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
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
    plugins: [require("daisyui")],
    daisyui: {
      themes: [
        {
          light: {
            ...require("daisyui/src/theming/themes")["light"],
            primary: "#9B4722",
            "primary-focus": "#8B3712",
          },
        },
      ],
    },
  };