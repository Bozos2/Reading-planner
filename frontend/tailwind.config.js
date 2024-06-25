/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#543310",
        secondary: "#74512D",
        third: "#AF8F6F",
        background: "#F8F4E1",
      },
      fontFamily: {
        mirza: ["Mirza", "sans-serif"],
      },
    },
  },
  plugins: [],
};
