/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"]
      },
      colors: {
        ink: "#172033",
        paper: "#f8fafc",
        cyanInk: "#0e7490",
        leaf: "#15803d",
        roseInk: "#be123c"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.10)"
      }
    }
  },
  plugins: []
};
