"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartProvider";

export function CartButton() {
  const { count, open } = useCart();
  return (
    <button
      onClick={open}
      aria-label={`Abrir carrinho (${count} itens)`}
      className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--fg)_20%,transparent)] glass transition-colors hover:border-[var(--accent)]"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold text-white"
            style={{ background: "var(--accent)", boxShadow: "0 0 14px -2px var(--accent)" }}
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
