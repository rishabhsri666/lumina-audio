/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#070707",
        surface: "#111111",
        elevated: "#1A1A1A",
        accent: "#8B5CF6",
        muted: "#A1A1AA",
      },

      boxShadow: {
        glow: "0 0 40px rgba(139,92,246,0.25)",
      },

      backgroundImage: {
        ambient:
          "radial-gradient(circle at top, rgba(139,92,246,0.18), transparent 45%)",
      },
    },
  },
  plugins: [],
};