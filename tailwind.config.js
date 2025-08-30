/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '',
        cornflourBlue: '#685EFC',
        juniorGreen: '#12895E',
        darkBlueGray: '#16252D',
        lightGray: '#A49595',
        hoveredGreen: '#37ffb7',
        lightStroke: '#c1eddd'
      }
    },
  },
  plugins: [],
};