/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      backgroundImage: {
        polandFlag: "url('./assets/polandflag.png')",
        englishFlag: "url('/assets/englishflag.png')"
      }
    },
  },
  plugins: [],
}