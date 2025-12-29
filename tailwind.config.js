/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        logo: ["Audiowide", "sans-serif"],
      },
      colors: {
        light: {
          50:  "#ffffff", 
          100: "#fafafa",
          200: "#f5f5f5",
          300: "#e5e5e5", 
          400: "#a3a3a3",
          500: "#737373", 
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717", 
        },
        dark: {
          50:  "#1a1a1a", 
          100: "#121212", 
          200: "#0a0a0a", 
          300: "#262626", 
          400: "#3f3f46",
          500: "#71717a",
          600: "#a1a1aa",
          700: "#d4d4d8",
          800: "#e4e4e7", 
          900: "#f4f4f5", 
        },
        brand: {
          primary: "#d73a49",
          soft: "rgba(255, 123, 114, 0.4)",
        }
      },
    },
  },
  plugins: [],
}