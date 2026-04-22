/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Fira Sans'", "system-ui", "sans-serif"],
        mono: ["'Fira Code'", "ui-monospace", "monospace"],
      },
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          900: "#1e3a8a",
        },
        accent: {
          50: "#fff7ed",
          100: "#ffedd5",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
        },
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.3s ease-out forwards",
        "fade-up-1": "fade-up 0.3s ease-out 0.06s forwards",
        "fade-up-2": "fade-up 0.3s ease-out 0.12s forwards",
        "fade-up-3": "fade-up 0.3s ease-out 0.18s forwards",
        "fade-up-4": "fade-up 0.3s ease-out 0.24s forwards",
      },
    },
  },
  plugins: [],
}
