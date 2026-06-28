"use client";

import { motion } from "framer-motion";
import { useTheme } from "../ThemeProvider";
import { useTilt } from "./useTilt";
import { SharinganEye } from "./SharinganEye";
import { SixEyesEye } from "./SixEyesEye";

/**
 * Olho gigante atrás do título do hero. Baixíssima opacidade, blur, giro
 * extremamente lento, acompanha o mouse (≤3°) com profundidade (preserve-3d).
 * Crossfade Sharingan ↔ Seis Olhos pelo morph. Não compete com o texto.
 */
export function HeroEye() {
  const { morph } = useTheme();
  const { rotateX, rotateY } = useTilt(3);
  const m = morph;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center lg:justify-end lg:pr-[2vw]"
      style={{ perspective: 900 }}
      aria-hidden="true"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative h-[66vmin] w-[66vmin] max-h-[640px] max-w-[640px] lg:translate-x-[8%]"
      >
        {/* Sharingan — decorativo a ~12% de opacidade: animações INTERNAS
            desligadas (animated=false). Só o giro externo lento (hero-eye-spin,
            transform puro, barato) permanece. Nada de blur (custo de composição
            sobre o canvas). Só renderiza se estiver minimamente visível. */}
        {m < 0.995 && (
          <div
            className="absolute inset-0 hero-eye-spin"
            style={{ opacity: (1 - m) * 0.12, animationDuration: "70s" }}
          >
            <SharinganEye className="h-full w-full" animated={false} idSuffix="hero" />
          </div>
        )}

        {/* Seis Olhos — etéreo */}
        {m > 0.005 && (
          <div
            className="absolute inset-0 hero-eye-spin"
            style={{ opacity: m * 0.16, animationDuration: "100s" }}
          >
            <SixEyesEye className="h-full w-full" animated={false} idSuffix="hero" />
          </div>
        )}

        {/* glow de fundo, na cor do universo ativo (sem blur — o gradiente já é
            suave; blur grande em elemento gigante é caro de compor) */}
        <div
          className="absolute inset-0 eye-pulse rounded-full"
          style={{
            background: `radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 60%)`,
            opacity: 0.5,
          }}
        />
      </motion.div>
    </div>
  );
}
