/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#1E1E1E',
        'card-bg': '#252525',
        'input-bg': '#2D2D2D',
        'accent-gold': '#FFD700',
        'accent-purple': '#800080',
        'purple-hover': '#9c27b0',
        'error': '#ff6b6b',
        'border-color': '#383838',
        'border-color-light': '#404040',
        'loading-dot': '#4a90e2',
      },
      fontFamily: {
        'segoe': ['Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.15)',
        'md': '0 2px 4px 0 rgba(0, 0, 0, 0.2)',
        'lg': '0 4px 6px -1px rgba(0, 0, 0, 0.25)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
      }
    },
  },
  plugins: [],
}