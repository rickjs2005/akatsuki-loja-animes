"use client";

import { useTheme } from "./ThemeProvider";

/**
 * Fullscreen cinematic flash that peaks at the midpoint of the theme morph.
 * Dark -> Light: blue energy explodes outward.
 * Light -> Dark: the energy implodes back to the core.
 */
export function TransitionOverlay() {
  const { morph, theme, isTransitioning } = useTheme();

  // 0 at both ends, 1 at the crossover — the "burst" moment
  const peak = Math.sin(Math.max(0, Math.min(1, morph)) * Math.PI);
  const goingLight = theme === "light";

  // ring expands toward light, contracts toward dark
  const ringScale = goingLight ? morph * 2.4 : (1 - morph) * 2.4 + 0.1;

  if (!isTransitioning && peak < 0.001) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {/* full-screen energy flash */}
      <div
        className="absolute inset-0"
        style={{
          opacity: peak,
          background: goingLight
            ? "radial-gradient(circle at 50% 50%, rgba(190,243,255,0.95), rgba(43,123,255,0.6) 40%, rgba(5,5,5,0) 70%)"
            : "radial-gradient(circle at 50% 50%, rgba(255,90,60,0.9), rgba(139,0,0,0.55) 40%, rgba(5,5,5,0) 70%)",
          mixBlendMode: goingLight ? "screen" : "screen",
        }}
      />
      {/* expanding shock ring */}
      <div
        className="absolute left-1/2 top-1/2 aspect-square w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          transform: `translate(-50%, -50%) scale(${ringScale})`,
          opacity: peak * 0.9,
          border: `2px solid ${goingLight ? "#3df0ff" : "#ff3b3b"}`,
          boxShadow: goingLight
            ? "0 0 80px 20px rgba(61,240,255,0.6) inset, 0 0 80px 20px rgba(61,240,255,0.6)"
            : "0 0 80px 20px rgba(200,26,26,0.6) inset, 0 0 80px 20px rgba(200,26,26,0.6)",
        }}
      />
      {/* fine grain / disintegration particles */}
      <div
        className="absolute inset-0"
        style={{
          opacity: peak * 0.5,
          backgroundImage: goingLight
            ? "radial-gradient(circle, rgba(190,243,255,0.8) 1px, transparent 1.4px)"
            : "radial-gradient(circle, rgba(255,80,60,0.8) 1px, transparent 1.4px)",
          backgroundSize: "26px 26px",
        }}
      />
    </div>
  );
}
