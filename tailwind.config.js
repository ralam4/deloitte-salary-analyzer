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
        "gradient-drift": {
          "0%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(calc(var(--tx-1) * 120px), calc(var(--ty-1) * 120px))" },
          "50%": { transform: "translate(calc(var(--tx-2) * 120px), calc(var(--ty-2) * 120px))" },
          "75%": { transform: "translate(calc(var(--tx-3) * 120px), calc(var(--ty-3) * 120px))" },
          "100%": { transform: "translate(0, 0)" },
        },
      },
      animation: {
        "gradient-drift": "gradient-drift var(--gradient-speed, 8s) ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
