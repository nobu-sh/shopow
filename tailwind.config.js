/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transitionDuration: {
        2000: "2000ms",
        3000: "3000ms",
        4000: "4000ms",
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
		require("tailwind-scrollbar"),
  ],
}