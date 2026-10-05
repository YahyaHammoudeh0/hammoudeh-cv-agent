/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // "Oasis": palm green + lime on a fresh off-white, tuned to the AUC scene.
        ink: "#10261A",
        "ink-mute": "#52665A",
        "ink-faint": "#8FA096",
        bg: "#F3F6F0",
        "bg-2": "#FFFFFF",
        "bg-3": "#E6EDE2",
        line: "#CFDACB",
        sand: "#1E6B3C", // primary accent: palm (token name kept for history)
        "sand-bright": "#24804A",
        "sand-deep": "#0E3D20", // button ledge
        tie: "#1E6B3C",
        "tie-deep": "#0E3D20",
        cool: "#1E6B3C",
        pop: "#D9F56B", // lime: only on palm/ink backgrounds
        sky: "#BFE0F5",
      },
      fontFamily: {
        sans: ["Figtree", "system-ui", "sans-serif"],
        display: ["Archivo", "Figtree", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0) rotate(var(--r, 0deg))" },
          "50%": { transform: "translateY(-8px) rotate(var(--r, 0deg))" },
        },
        pop: {
          "0%": { transform: "scale(0.6) translateY(6px)", opacity: "0" },
          "60%": { transform: "scale(1.06) translateY(-2px)", opacity: "1" },
          "100%": { transform: "scale(1) translateY(0)", opacity: "1" },
        },
        rise: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-46px)", opacity: "0" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        floaty: "floaty 5s ease-in-out infinite",
        pop: "pop 0.38s cubic-bezier(.2,.9,.3,1.3) both",
        rise: "rise 0.9s ease-out forwards",
      },
    },
  },
  plugins: [],
};
