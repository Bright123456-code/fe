/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        swu: {
          black: '#0A0A0A',
          gold: '#FFCD00',
          'gold-light': '#FFF3B0',
          'gold-dark': '#E6B800',
          'gold-muted': '#FFF8D6',
          gray: '#F5F5F0',
          'gray-mid': '#E8E8E3',
          muted: '#6B7280',
        },
        primary: {
          50: '#FFFDF0',
          100: '#FFF8D6',
          200: '#FFF3B0',
          300: '#FFE566',
          400: '#FFD700',
          500: '#FFCD00',
          600: '#E6B800',
          700: '#CC9900',
          800: '#997300',
          900: '#664D00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'gold': '0 0 0 3px rgba(255, 205, 0, 0.3)',
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
