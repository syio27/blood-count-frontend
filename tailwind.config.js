/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      backgroundImage: {
        polandFlag: "url('./assets/polandflag.png')",
        englishFlag: "url('/assets/englishflag.png')",
        account: "url('/assets/user.png')",
        noData: "url('/assets/noData.jpeg')",
      },
    },
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}