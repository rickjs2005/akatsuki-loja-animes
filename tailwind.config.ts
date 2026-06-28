import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        akatsuki: {
          black: "#050505",
          blood: "#8B0000",
          red: "#c81a1a",
          ember: "#ff3b3b",
          graphite: "#1a1a1d",
          ash: "#9a9a9e",
        },
        domain: {
          white: "#f7fbff",
          cyan: "#3df0ff",
          neon: "#2b7bff",
          deep: "#0a2a4f",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      // Escala tipográfica fluida (clamp) — níveis nomeados e consistentes
      fontSize: {
        "display-1": [
          "clamp(2.75rem, 6vw, 5.5rem)",
          { lineHeight: "0.95", letterSpacing: "-0.02em" },
        ],
        "display-2": [
          "clamp(2.25rem, 4.5vw, 4rem)",
          { lineHeight: "1", letterSpacing: "-0.015em" },
        ],
        h1: [
          "clamp(1.875rem, 3.5vw, 3rem)",
          { lineHeight: "1.1", letterSpacing: "-0.01em" },
        ],
        h2: [
          "clamp(1.5rem, 2.5vw, 2.25rem)",
          { lineHeight: "1.15", letterSpacing: "-0.005em" },
        ],
        h3: [
          "clamp(1.25rem, 1.8vw, 1.5rem)",
          { lineHeight: "1.25", letterSpacing: "0em" },
        ],
        body: ["1rem", { lineHeight: "1.6", letterSpacing: "0.005em" }],
        caption: [
          "0.8125rem",
          { lineHeight: "1.4", letterSpacing: "0.02em" },
        ],
      },
      // Tokens semânticos de espaçamento
      spacing: {
        section: "clamp(4rem, 10vw, 9rem)",
        gutter: "1.5rem",
      },
      // Tokens de raio
      borderRadius: {
        card: "1.5rem",
        pill: "9999px",
      },
      // Glows temáticos baseados na var de acento
      boxShadow: {
        glow: "0 0 30px -6px var(--accent)",
        "glow-lg": "0 0 60px -4px var(--accent)",
      },
      // Easing cinematográfico
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      // Anel de foco usa o acento por padrão
      ringColor: {
        DEFAULT: "var(--accent)",
      },
      ringWidth: {
        DEFAULT: "2px",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.8", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.03)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 6s ease-in-out infinite",
        float: "float 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
