/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#f5efe6",
        "ink-mute": "#9ca3af",
        "ink-faint": "#4a463e",
        bg: "#0b0a08",
        "bg-2": "#14110d",
        line: "#2a2620",
        sand: "#d4a574",
        "sand-bright": "#e6b988",
        cool: "#6b9bd1",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
