/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f6f2ff",
          100: "#eee7ff",
          200: "#d9ccff",
          300: "#bda3ff",
          400: "#9a6bff",
          500: "#7a3cff",
          600: "#6d28d9",
          700: "#5b21b6",
          800: "#4c1d95",
          900: "#3b1672",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
