/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily: {
      'sans': ['Roboto', 'sans-serif']
    },
    extend: {
      backgroundImage:{
      "home": "url('https://raw.githubusercontent.com/AlissonClaro/Hamburgueria/main/assets/bg.png')"
      }
    },
  },
  plugins: [],
}

