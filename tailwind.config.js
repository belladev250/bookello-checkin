/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/index.html',
    './src/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1F2D5C',
        orange: '#FFA54C',
      },
    },
  },
  plugins: [],
}
