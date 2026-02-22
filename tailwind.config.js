/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        display: ["Syne", "Space Grotesk", "sans-serif"],
      },
      colors: {
        space: {
          bg:      "#020817",
          card:    "rgba(255,255,255,0.05)",
          border:  "rgba(255,255,255,0.10)",
        },
      },
      animation: {
        "blob-1": "blob 18s infinite ease-in-out",
        "blob-2": "blob 22s infinite ease-in-out reverse",
        "blob-3": "blob 16s infinite ease-in-out 4s",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        blob: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "33%":      { transform: "translate(60px,-50px) scale(1.1)" },
          "66%":      { transform: "translate(-40px,40px) scale(0.9)" },
        },
      },
      backdropBlur: { xl: "24px" },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.4)",
        glow:  "0 0 20px rgba(139,92,246,0.4)",
      },
    },
  },
  plugins: [],
};
