/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        surface: {
          DEFAULT: "#0f172a",
          dark: "#020617",
          card: "rgba(15, 23, 42, 0.6)",
        },
      },
      keyframes: {
        "background-gradient": {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "20%": { transform: "translate(calc(var(--tx-1) * 200px), calc(var(--ty-1) * 200px)) scale(1.05)" },
          "40%": { transform: "translate(calc(var(--tx-2) * 200px), calc(var(--ty-2) * 200px)) scale(0.95)" },
          "60%": { transform: "translate(calc(var(--tx-3) * 200px), calc(var(--ty-3) * 200px)) scale(1.1)" },
          "80%": { transform: "translate(calc(var(--tx-4) * 200px), calc(var(--ty-4) * 200px)) scale(0.98)" },
          "100%": { transform: "translate(0, 0) scale(1)" },
        },
      },
      animation: {
        "background-gradient": "background-gradient calc(var(--background-gradient-speed, 0.1s) * 100) ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
