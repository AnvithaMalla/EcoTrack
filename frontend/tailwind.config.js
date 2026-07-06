/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f4f7fb',
          100: '#e7eef8',
          200: '#c9d8ea',
          300: '#9fb5d1',
          400: '#7490b3',
          500: '#4b6c8d',
          600: '#35506d',
          700: '#24384c',
          800: '#142131',
          900: '#0b1320'
        },
        mint: {
          50: '#ecfff8',
          100: '#cff8e9',
          200: '#a1f0d0',
          300: '#6ae3b3',
          400: '#2fca92',
          500: '#15a473',
          600: '#0d7e59',
          700: '#0a5d42'
        },
        sand: {
          50: '#fffaf1',
          100: '#fff1d5',
          200: '#ffe0a5',
          300: '#ffc869',
          400: '#ffab31',
          500: '#f98a12',
          600: '#d96a07'
        }
      },
      boxShadow: {
        glow: '0 20px 80px rgba(21, 164, 115, 0.18)'
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at 20% 20%, rgba(21,164,115,0.14), transparent 24%), radial-gradient(circle at 80% 0%, rgba(249,138,18,0.15), transparent 20%), linear-gradient(180deg, rgba(15,23,42,0.04), rgba(15,23,42,0.02))'
      }
    }
  },
  plugins: []
};
