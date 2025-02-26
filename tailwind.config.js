/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'hanken-grotesk': ['Hanken Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
};