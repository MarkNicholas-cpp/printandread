/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Exact Color Palette from Design
          // Dark Purple - Primary brand color
          primary: "#3D348B",
          'primary-dark': "#2D2468",
          'primary-light': "#4D42A8",

          // Medium Blue-Purple - Accent, highlights
          accent: "#7678ED",
          'accent-light': "#9B9DF0",
          'accent-dark': "#5A5CB8",

          // Bright Yellow-Orange - Success, highlights, CTAs
          success: "#F7B801",
          'success-light': "#F9C933",
          'success-dark': "#D99E01",

          // Orange - Warning, alerts, secondary actions
          warning: "#F18701",
          'warning-light': "#F4A533",
          'warning-dark': "#C96D01",

          // Dark Orange - Emphasis, important actions
          'orange-dark': "#F35B04",
          'orange-dark-light': "#F67A33",
          'orange-dark-dark': "#C24903",

          // Background & Surface
          'bg-primary': "#F8F9FB",
          'bg-secondary': "#FFFFFF",

          // Slate Gray - UI elements, secondary text
          'slate': "#4B5563",
          'slate-light': "#6B7280",
          'slate-dark': "#374151",

          // Legacy colors (kept for compatibility)
          sand: "#F7F1E6",
          charcoal: "#2E3440",
          mint: "#6FD08C"
        }
      },
      fontFamily: {
        // EdTech Font Stack
        'heading': ['Montserrat', 'Poppins', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'Montserrat', 'system-ui', 'sans-serif'],
        'body': ['Open Sans', 'Inter', 'Roboto', 'system-ui', 'sans-serif'],
        'sans': ['Inter', 'Open Sans', 'Roboto', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'large': '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
}

