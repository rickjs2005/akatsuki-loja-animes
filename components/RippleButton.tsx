"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "ghost";
};

export function RippleButton({
  children,
  className = "",
  variant = "solid",
  onClick,
  ...rest
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);

  const handle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = ref.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const dot = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      dot.className = "ripple-dot";
      dot.style.width = dot.style.height = `${size}px`;
      dot.style.left = `${e.clientX - rect.left - size / 2}px`;
      dot.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(dot);
      window.setTimeout(() => dot.remove(), 700);
    }
    onClick?.(e);
  };

  const base =
    "ripple btn-cine relative inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold tracking-wide uppercase transition-all duration-300";
  const styles =
    variant === "solid"
      ? "text-white shadow-[0_0_30px_-4px_var(--accent)] hover:shadow-[0_0_60px_-2px_var(--accent)]"
      : "border border-[color-mix(in_srgb,var(--fg)_25%,transparent)] text-[var(--fg)] hover:border-[var(--accent)] hover:shadow-[0_0_40px_-8px_var(--accent)]";

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      onClick={handle}
      className={`${base} ${styles} ${className}`}
      style={
        variant === "solid"
          ? { background: "var(--accent)" }
          : undefined
      }
      {...(rest as any)}
    >
      {children}
    </motion.button>
  );
}
