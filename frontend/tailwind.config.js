/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode:"class",
  theme: {
    extend: {
      colors: {
        brand: {
          gold: "#B48E57",
          goldDark: "#FFD700",
        },
        light: {
          bg: "#F9FAFB",
          surface: "#FFFFFF",
          text: "#111827",
          textSecondary: "#374151",
          border: "#E5E7EB",
        },
        dark: {
          bg: "#0B0B0D",
          surface: "#1A1A1D",
          hover: "#252527",
          text: "#F9FAFB",
          textSecondary: "#D1D5DB",
          border: "#1E293B",
        },
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
        brand: ["Great Vibes", "cursive"],
      },
    },
  },
  plugins: [],
};
