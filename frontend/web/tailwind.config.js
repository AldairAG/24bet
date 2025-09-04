/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'casino-red': {
          50: '#ffebee',
          100: '#ffcdd2',
          200: '#ef9a9a',
          300: '#e57373',
          400: '#ef5350',
          500: '#f44336',
          600: '#e53935',
          700: '#d32f2f',
          800: '#c62828',
          900: '#b71c1c',
        },
        'casino-gold': {
          50: '#fffef7',
          100: '#fffacd',
          200: '#fff59d',
          300: '#fff176',
          400: '#ffee58',
          500: '#ffeb3b',
          600: '#fdd835',
          700: '#fbc02d',
          800: '#f9a825',
          900: '#f57f17',
        }
      },
      backgroundImage: {
        'casino-gradient': 'linear-gradient(135deg, #b71c1c, #d32f2f, #f44336)',
        'hero-pattern': 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s infinite',
        'slide-up': 'slide-up 0.6s ease-out forwards',
        'shimmer': 'shimmer 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-30px) rotate(180deg)' },
        },
        'pulse-glow': {
          '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(244, 67, 54, 0.7)' },
          '70%': { transform: 'scale(1.05)', boxShadow: '0 0 0 10px rgba(244, 67, 54, 0)' },
          '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(244, 67, 54, 0)' },
        },
        'slide-up': {
          'from': { opacity: '0', transform: 'translateY(50px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        glow: {
          '0%': { textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.6)' },
          '100%': { textShadow: '0 0 30px rgba(255, 255, 255, 1), 0 0 60px rgba(255, 255, 255, 0.8)' },
        },
      },
      fontFamily: {
        'casino': ['Impact', 'Arial Black', 'sans-serif'],
      },
      boxShadow: {
        'casino': '0 8px 25px rgba(244, 67, 54, 0.4)',
        'casino-hover': '0 12px 35px rgba(244, 67, 54, 0.6)',
        'game-card': '0 15px 40px rgba(244, 67, 54, 0.3)',
      }
    },
  },
  plugins: [],
}
