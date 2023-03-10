/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media", // "class"
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        // Simple 16 column grid
        cell: "repeat(3, minmax(0, 6rem))",
      },
      gridTemplateRows: {
        // Simple 16 column grid
        cell: "repeat(3, minmax(0, 6rem))",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        wiggle: "wiggle 200ms ease-in-out",
      },
    },
  },
  plugins: [],
};
