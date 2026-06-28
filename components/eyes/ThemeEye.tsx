"use client";

import { motion } from "framer-motion";
import { useTheme } from "../ThemeProvider";
import { useTilt } from "./useTilt";
import { SharinganEye } from "./SharinganEye";
import { SixEyesEye } from "./SixEyesEye";

/**
 * Olho do tema ativo (usado no toggle). Faz crossfade Sharingan ↔ Seis Olhos
 * conforme o morph, acompanha o mouse (≤3°) e tem glow pulsante por universo.
 */
export function ThemeEye({ size = 30 }: { size?: number }) {
  const { morph } = useTheme();
  const { rotateX, rotateY } = useTilt(3);

  // motion value derivado do morph para o glow seguir o crossfade
  const m = morph;

  return (
    <div style={{ perspective: 220 }} className="relative">
      <motion.div
        style={{
          width: size,
          height: size,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative"
      >
        {/* Sharingan */}
        <div
          className="absolute inset-0 eye-pulse"
          style={{
            opacity: 1 - m,
            filter: `drop-shadow(0 0 ${5 + (1 - m) * 6}px rgba(200,26,26,${
              0.65 * (1 - m)
            }))`,
          }}
        >
          <SharinganEye className="h-full w-full" animated idSuffix="toggle" spin={10} />
        </div>

        {/* Seis Olhos */}
        <div
          className="absolute inset-0 eye-pulse"
          style={{
            opacity: m,
            filter: `drop-shadow(0 0 ${5 + m * 6}px rgba(61,240,255,${0.7 * m}))`,
          }}
        >
          <SixEyesEye className="h-full w-full" animated idSuffix="toggle" spin={22} />
        </div>
      </motion.div>
    </div>
  );
}
