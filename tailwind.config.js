const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'myred': '#ff0000',
        'mycream': "#fef8ee",
        'greyLight-1': '#E4EBF5',
        'greyLight-2': '#c8d0e7',
        'greyLight-3': '#bec8e4',
        'greyDark': '#9baacf'
      },
      fontFamily: {
        "kiddie": ["Fredoka One", ...defaultTheme.fontFamily.sans],
        "funky": ["Shrikhand", ...defaultTheme.fontFamily.sans]
      }
    }
  },
  plugins: [],
}