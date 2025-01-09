import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D4B886',
        'primary-focus': '#C4A876',
        secondary: '#9B8579',
        'secondary-focus': '#8B7569',
        text: '#2C3E50',
        'mystic': {
          50: '#F5EDE4',
          100: '#EBD9C4',
          200: '#D4B886',
          300: '#C4A876',
          400: '#B39666',
          500: '#A38456',
          600: '#937246',
          700: '#836036',
          800: '#735026',
          900: '#634016'
        }
      },
      animation: {
        'spin-slow': 'spin 30s linear infinite',
        'spin-reverse-slow': 'spin-reverse 20s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'flow': 'flow 4s linear infinite',
        'dash': 'dash 20s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'scale': 'scale 2s ease-in-out infinite',
        'morph': 'morph 8s ease-in-out infinite',
        'shimmer': 'shimmer 2.2s linear infinite',
        'ripple': 'ripple 3s linear infinite',
        'orbit': 'orbit 20s linear infinite',
        'wave': 'wave 2s ease-in-out infinite',
      },
      keyframes: {
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        'flow': {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '20' },
        },
        'dash': {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '40' },
        },
        'glow': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1.5) blur(2px)' },
          '50%': { opacity: '0.6', filter: 'brightness(1) blur(4px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'scale': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        'morph': {
          '0%, 100%': { borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40%/50% 60% 30% 60%' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
        'ripple': {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        'orbit': {
          '0%': { transform: 'rotate(0deg) translateX(100px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(100px) rotate(-360deg)' },
        },
        'wave': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(15deg)' },
          '75%': { transform: 'rotate(-15deg)' },
        },
      },
      rotate: {
        '30': '30deg',
        '60': '60deg',
        '135': '135deg',
      },
      transformOrigin: {
        'center-left': '0 50%',
        'top-center': '50% 0',
      },
      perspective: {
        '1000': '1000px',
        '2000': '2000px',
        '3000': '3000px',
        '4000': '4000px',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-shine': 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.3) 50%, transparent 75%)',
      },
      boxShadow: {
        'neon': '0 0 5px theme(colors.primary.200), 0 0 20px theme(colors.primary.400), 0 0 60px theme(colors.primary.600)',
        'neon-strong': '0 0 5px theme(colors.primary.200), 0 0 20px theme(colors.primary.400), 0 0 60px theme(colors.primary.600), 0 0 100px theme(colors.primary.800)',
      },
      dropShadow: {
        'neon': '0 0 2px theme(colors.primary.200)',
        'neon-strong': ['0 0 2px theme(colors.primary.200)', '0 0 8px theme(colors.primary.400)'],
      },
    },
  },
  plugins: [],
}

export default config 