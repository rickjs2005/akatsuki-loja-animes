"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import { SharinganEye } from "./eyes/SharinganEye";
import { SixEyesEye } from "./eyes/SixEyesEye";

/**
 * Troca de tema coreografada em 3 tempos (um de cada vez):
 *   BEAT 1 — OLHO:       o olho do universo que CHEGA "ativa" (cresce e carrega).
 *   BEAT 2 — COR:        estouro de luz + onda de choque; o fundo/cor vira aqui.
 *   BEAT 3 — PARTÍCULAS: faíscas explodem para fora na nova cor; o olho recua
 *                        revelando o novo mundo.
 *
 * Dark → Light: abre o olho dos Seis Olhos (azul). Light → Dark: ativa o
 * Sharingan (vermelho). Processo inverso em cada sentido.
 * Sob prefers-reduced-motion a troca é instantânea (sem overlay).
 */

const PARTICLES = Array.from({ length: 20 }, (_, i) => {
  const angle = (i / 20) * Math.PI * 2 + (i % 2 ? 0.16 : -0.12);
  const dist = 34 + ((i * 7) % 22); // vmax
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
    size: 4 + ((i * 5) % 7),
    delayStep: (i % 5) * 0.018,
  };
});

export function TransitionOverlay() {
  const { isTransitioning, theme, transitionKey, duration } = useTheme();
  const reduced = usePrefersReducedMotion();

  if (reduced) return null;

  const goingLight = theme === "light";
  const D = duration / 1000; // segundos

  // cores do universo que ESTÁ CHEGANDO
  const core = goingLight ? "rgba(190,243,255,0.95)" : "rgba(255,90,60,0.95)";
  const mid = goingLight ? "rgba(43,123,255,0.6)" : "rgba(139,0,0,0.55)";
  const ringColor = goingLight ? "#3df0ff" : "#ff3b3b";
  const particleColor = goingLight ? "#7fe8ff" : "#ff6a3c";

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key={transitionKey}
          className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* ===== BEAT 1 — OLHO que chega (ativa primeiro) ===== */}
          <motion.div
            className="absolute left-1/2 top-1/2 h-[44vmin] w-[44vmin] -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0.28, opacity: 0, rotate: goingLight ? -16 : 16 }}
            animate={{
              scale: [0.28, 1, 1.04, 1.45],
              opacity: [0, 1, 1, 0],
              rotate: 0,
            }}
            transition={{
              duration: D,
              times: [0, 0.38, 0.62, 1],
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              filter: `drop-shadow(0 0 40px ${mid})`,
            }}
          >
            {goingLight ? (
              <SixEyesEye className="h-full w-full" animated idSuffix="tx" spin={6} />
            ) : (
              <SharinganEye className="h-full w-full" animated idSuffix="tx" spin={2.4} />
            )}
          </motion.div>

          {/* ===== BEAT 2 — COR: estouro radial de luz ===== */}
          <motion.div
            className="absolute inset-0"
            style={{ mixBlendMode: "screen" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 1, 0] }}
            transition={{ duration: D, times: [0, 0.32, 0.52, 0.9] }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${core}, ${mid} 38%, rgba(5,5,5,0) 70%)`,
              }}
            />
          </motion.div>

          {/* onda de choque */}
          <motion.div
            className="absolute left-1/2 top-1/2 aspect-square w-[40vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
            initial={{ scale: 0.1, opacity: 0 }}
            animate={{ scale: [0.1, 0.4, 2.6], opacity: [0, 0.9, 0] }}
            transition={{ duration: D, times: [0.3, 0.5, 1], ease: "easeOut" }}
            style={{
              border: `2px solid ${ringColor}`,
              boxShadow: `0 0 80px 20px ${ringColor}55, inset 0 0 80px 20px ${ringColor}55`,
            }}
          />

          {/* ===== BEAT 3 — PARTÍCULAS: faíscas explodem para fora ===== */}
          {PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: p.size,
                height: p.size,
                background: particleColor,
                boxShadow: `0 0 ${p.size * 2.4}px ${particleColor}`,
                marginLeft: -p.size / 2,
                marginTop: -p.size / 2,
              }}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
              animate={{
                x: [`0vmax`, `${p.x}vmax`],
                y: [`0vmax`, `${p.y}vmax`],
                opacity: [0, 1, 0],
                scale: [0.4, 1, 0.2],
              }}
              transition={{
                duration: D * 0.46,
                delay: D * 0.54 + p.delayStep,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
