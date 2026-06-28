"use client";

import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { ThemeEye } from "./eyes/ThemeEye";

export function ThemeToggle() {
  const { theme, toggle, isTransitioning } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      onClick={toggle}
      disabled={isTransitioning}
      aria-label={isLight ? "Ativar modo Uchiha (escuro)" : "Ativar modo Seis Olhos (claro)"}
      title={isLight ? "Modo Satoru Gojo" : "Modo Uchiha"}
      className="group relative flex h-11 w-[78px] items-center rounded-full px-1.5 transition-all duration-500 disabled:cursor-not-allowed"
      style={{
        border: `1px solid color-mix(in srgb, var(--accent) 45%, transparent)`,
        background: isLight
          ? "linear-gradient(120deg, rgba(190,243,255,0.18), rgba(43,123,255,0.12))"
          : "linear-gradient(120deg, rgba(40,4,4,0.55), rgba(10,2,2,0.4))",
        boxShadow: `0 0 18px -4px var(--accent), inset 0 0 14px -8px var(--accent)`,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="flex h-8 w-8 items-center justify-center rounded-full"
        style={{ marginLeft: isLight ? "auto" : 0 }}
      >
        <ThemeEye size={30} />
      </motion.span>
    </button>
  );
}
