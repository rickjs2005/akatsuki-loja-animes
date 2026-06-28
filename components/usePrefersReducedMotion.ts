"use client";

import { useEffect, useState } from "react";

/**
 * Retorna `true` quando o usuário pediu redução de movimento
 * (`prefers-reduced-motion: reduce`). SSR-safe: começa em `false`
 * e atualiza no cliente, reagindo a mudanças da media query.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    // addEventListener é o moderno; alguns Safari antigos usam addListener
    if (mq.addEventListener) {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  return reduced;
}
