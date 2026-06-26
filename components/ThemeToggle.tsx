"use client";

import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggle, isTransitioning } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      onClick={toggle}
      disabled={isTransitioning}
      aria-label="Alternar tema"
      className="group relative flex h-11 w-[88px] items-center rounded-full border border-[color-mix(in_srgb,var(--fg)_20%,transparent)] glass px-1.5 disabled:opacity-60"
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="flex h-8 w-8 items-center justify-center rounded-full"
        style={{
          marginLeft: isLight ? "auto" : 0,
          background: isLight
            ? "radial-gradient(circle at 30% 30%, #bdf3ff, #2b7bff)"
            : "radial-gradient(circle at 30% 30%, #ff5a3c, #8B0000)",
          boxShadow: isLight
            ? "0 0 22px 2px #3df0ff"
            : "0 0 22px 2px #c81a1a",
        }}
      >
        <motion.span
          animate={{ rotate: isLight ? 0 : 180 }}
          className="text-[13px]"
        >
          {isLight ? "☀" : "☾"}
        </motion.span>
      </motion.span>
    </button>
  );
}
