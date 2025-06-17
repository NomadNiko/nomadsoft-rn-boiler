/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './screens/**/*.{js,ts,tsx}',
    './navigation/**/*.{js,ts,tsx}',
    './styles/**/*.{js,ts,tsx}',
    './contexts/**/*.{js,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Oxanium-Regular'],
        'oxanium-light': ['Oxanium-Light'],
        'oxanium-regular': ['Oxanium-Regular'],
        'oxanium-medium': ['Oxanium-Medium'],
        'oxanium-semibold': ['Oxanium-SemiBold'],
        'oxanium-bold': ['Oxanium-Bold'],
        'oxanium-extrabold': ['Oxanium-ExtraBold'],
      },
    },
  },
  plugins: [],
};
