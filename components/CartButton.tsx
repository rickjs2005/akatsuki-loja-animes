"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartProvider";
import { CartIcon } from "@/components/icons";

export function CartButton() {
  const { count, open } = useCart();
  return (
    <button
      onClick={open}
      aria-label={`Abrir carrinho (${count} itens)`}
      className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--fg)_20%,transparent)] glass transition-colors hover:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
    >
      <CartIcon />
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
