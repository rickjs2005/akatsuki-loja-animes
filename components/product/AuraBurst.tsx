"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Explosão de aura ("liberação de poder") ao adicionar o produto ao carrinho.
 * Renderiza glow, anel, flash radial vindo de baixo e chamas de energia
 * subindo na cor do personagem. As partículas são geradas internamente.
 *
 * É decorativo: `pointer-events-none` em tudo, não bloqueia cliques.
 */
export function AuraBurst({
  aura,
  active,
  sparkCount = 16,
}: {
  /** Cor da aura do personagem. */
  aura: string;
  /** Quando true, dispara a animação. */
  active: boolean;
  /** Número de partículas de energia. */
  sparkCount?: number;
}) {
  // partículas de energia que sobem na cor do personagem ao adicionar
  const sparks = useMemo(
    () =>
      Array.from({ length: sparkCount }, () => ({
        x: 4 + Math.random() * 92,
        size: 3 + Math.random() * 5,
        rise: 300 + Math.random() * 240,
        sway: (Math.random() - 0.5) * 46,
        dur: 1.0 + Math.random() * 0.65,
        delay: Math.random() * 0.35,
      })),
    [sparkCount]
  );

  return (
    <AnimatePresence>
      {active && (
        <>
          <motion.div
            key="aura-glow"
            aria-hidden
            className="pointer-events-none absolute -inset-3 rounded-[2rem]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: [0, 1, 0.7, 0], scale: [0.9, 1.05, 1.02, 1.08] }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ boxShadow: `0 0 70px 10px ${aura}, inset 0 0 46px ${aura}`, border: `2px solid ${aura}` }}
          />
          <motion.div
            key="aura-ring"
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl"
            initial={{ opacity: 0.85, scale: 0.92 }}
            animate={{ opacity: 0, scale: 1.32 }}
            transition={{ duration: 0.95, ease: "easeOut" }}
            style={{ border: `2px solid ${aura}` }}
          />
          {/* flash radial vindo de baixo (energia subindo) */}
          <motion.div
            key="aura-flash"
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.55, 0] }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            style={{ background: `radial-gradient(120% 80% at 50% 100%, ${aura}, transparent 65%)`, mixBlendMode: "screen" }}
          />
          {/* chamas de energia subindo na cor do personagem */}
          <div key="aura-sparks" aria-hidden className="pointer-events-none absolute inset-0 overflow-visible">
            {sparks.map((s, i) => (
              <motion.span
                key={i}
                className="absolute bottom-2"
                style={{ left: `${s.x}%`, transformOrigin: "center bottom", filter: `drop-shadow(0 0 ${s.size * 1.7}px ${aura})` }}
                initial={{ opacity: 0, y: 0, scaleY: 0.5, scaleX: 0.7 }}
                animate={{
                  opacity: [0, 1, 0.9, 0],
                  y: [-6, -s.rise],
                  x: [0, s.sway, 0],
                  scaleY: [0.6, 1.25, 0.95, 0.4],
                  scaleX: [0.75, 1, 0.85, 0.6],
                }}
                transition={{ duration: s.dur, delay: s.delay, ease: "easeOut" }}
              >
                <svg width={s.size * 2.2} height={s.size * 3.6} viewBox="0 0 20 32" aria-hidden>
                  <path d="M10 0 C3 12 4 21 10 32 C16 21 17 12 10 0 Z" fill={aura} />
                  <path d="M10 8 C6.5 15 7 22 10 28 C13 22 13.5 15 10 8 Z" fill="#ffffff" opacity="0.55" />
                </svg>
              </motion.span>
            ))}
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
