/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0B3D91",
          accent: "#00A79D",
          sand: "#F7F1E6",
          charcoal: "#2E3440",
          mint: "#6FD08C"
        }
      }
    },
  },
  plugins: [],
}

