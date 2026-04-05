/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./inertia/**/*.tsx",
    "./inertia/**/*.ts",
    "./resources/views/**/*.edge",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#C35100",
        "primary-light": "#D66112",
        "primary-dark": "#9A3412",
        "background-off": "#FEFDFB",
        "accent-orange": "#A33F00",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      }
    },
  },
  plugins: [],
}
