/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bba: {
          navy: '#050167',       // Deep Royal Oxford Navy
          'navy-light': '#0b0885',
          'navy-dark': '#030045',
          midnight: '#001f3f',   // Midnight Dark Blue
          'midnight-card': '#032952',
          ice: '#f0faff',        // Soft Ice Tint Background
          'ice-card': '#ffffff',
          mint: '#40ffa7',       // Vivid Neo-Mint Accent
          'mint-hover': '#2be08d',
          'mint-light': '#e8fff4',
          'mint-muted': '#32c984'
        },
        brand: {
          50: '#f0faff',
          100: '#e0f4ff',
          200: '#b8e6ff',
          300: '#7ad0ff',
          400: '#33b3ff',
          500: '#0090f0',
          600: '#050167',
          700: '#001f3f',
          800: '#030045',
          900: '#010025',
          950: '#000814',
        },
        slate: {
          850: '#151f32',
          950: '#001f3f',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
