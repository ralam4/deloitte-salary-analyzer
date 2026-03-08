/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        serif: ["'Instrument Serif'", "Georgia", "serif"],
        mono: ["'Geist Mono'", "monospace"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "mesh-move": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        "fade-up-1": "fade-up 0.6s ease-out 0.1s forwards",
        "fade-up-2": "fade-up 0.6s ease-out 0.2s forwards",
        "fade-up-3": "fade-up 0.6s ease-out 0.3s forwards",
        "fade-up-4": "fade-up 0.6s ease-out 0.4s forwards",
        "mesh-move": "mesh-move 20s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
