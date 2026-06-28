"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring, MotionValue } from "framer-motion";

/**
 * Inclinação 3D discreta seguindo o mouse (máx ±maxDeg graus).
 * Compartilha um único listener global e devolve motion values com mola
 * para aplicar em rotateX/rotateY sobre um container com preserve-3d.
 */
export function useTilt(maxDeg = 3): {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
} {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 120, damping: 18, mass: 0.4 });
  const rotateY = useSpring(ry, { stiffness: 120, damping: 18, mass: 0.4 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // sem mouse

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1; // -1..1
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      ry.set(nx * maxDeg);
      rx.set(-ny * maxDeg);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [maxDeg, rx, ry]);

  return { rotateX, rotateY };
}
