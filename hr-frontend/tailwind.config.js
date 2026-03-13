/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        mist: '#f1f5f9',
        teal: '#0f766e',
        glow: '#14b8a6'
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Source Sans 3"', 'sans-serif']
      },
      boxShadow: {
        soft: '0 20px 40px rgba(15, 23, 42, 0.12)'
      }
    }
  },
  plugins: []
};