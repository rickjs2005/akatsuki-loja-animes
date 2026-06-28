"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

/**
 * Camada atmosférica leve (1 canvas + rAF) dirigida pelo morph:
 *  - dark (Uchiha): névoa vermelha sutil, partículas e brasas subindo lentas.
 *  - light (Gojo): poeira azul iluminada flutuando + raios volumétricos discretos.
 * Pausa com a aba oculta e respeita prefers-reduced-motion.
 */
type P = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  ember: boolean;
};

export function AtmosphereLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { morphRef } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = reduce ? 0 : 48;
    const spawn = (initial = false): P => {
      const ember = Math.random() < 0.22;
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : h + 10,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -(0.12 + Math.random() * 0.35) * (ember ? 1.4 : 1),
        r: ember ? 0.8 + Math.random() * 1.4 : 0.5 + Math.random() * 1.8,
        life: Math.random(),
        ember,
      };
    };
    const parts: P[] = Array.from({ length: COUNT }, () => spawn(true));

    let raf = 0;
    let running = true;
    let t = 0;
    let last = 0;
    const minDelta = 1000 / 30; // limita a ~30fps (fundo atmosférico, basta)

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!running) return;
      if (now - last < minDelta) return; // pula frames acima de 30fps
      last = now;
      t += 0.006;
      const m = morphRef.current; // 0 dark -> 1 light
      ctx.clearRect(0, 0, w, h);

      // ---- névoa / atmosfera base ----
      // dark: névoa vermelha das bordas inferiores
      if (m < 0.98) {
        const g = ctx.createRadialGradient(
          w * 0.5,
          h * 1.05,
          0,
          w * 0.5,
          h * 1.05,
          h * 0.9
        );
        g.addColorStop(0, `rgba(120,8,8,${0.16 * (1 - m)})`);
        g.addColorStop(1, "rgba(120,8,8,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // light: raios volumétricos diagonais + bloom frio
      if (m > 0.02) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        const rays = 5;
        for (let i = 0; i < rays; i++) {
          const cx = w * (0.12 + i * 0.2) + Math.sin(t + i) * 24;
          const grad = ctx.createLinearGradient(cx, 0, cx + 120, h);
          const a = 0.05 * m * (0.6 + 0.4 * Math.sin(t * 1.3 + i));
          grad.addColorStop(0, `rgba(160,220,255,${a})`);
          grad.addColorStop(1, "rgba(160,220,255,0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(cx - 50, 0);
          ctx.lineTo(cx + 50, 0);
          ctx.lineTo(cx + 220, h);
          ctx.lineTo(cx + 120, h);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      // ---- partículas ----
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (const p of parts) {
        p.x += p.vx + Math.sin(t + p.life * 6) * 0.15;
        p.y += p.vy * (m > 0.5 ? 0.6 : 1); // no light flutuam mais lento
        if (p.y < -10 || p.x < -10 || p.x > w + 10) {
          Object.assign(p, spawn());
        }
        const twinkle = 0.5 + 0.5 * Math.sin(t * 4 + p.life * 9);

        // cor crossfade vermelho/brasa -> azul/poeira
        let cr: number, cg: number, cb: number, alpha: number;
        if (m < 0.5) {
          // dark: brasas alaranjadas + partículas vermelhas
          cr = p.ember ? 255 : 220;
          cg = p.ember ? 110 : 40;
          cb = p.ember ? 40 : 30;
          alpha = (p.ember ? 0.55 : 0.32) * (1 - m * 1.6) * twinkle;
        } else {
          // light: poeira azul iluminada
          cr = 150;
          cg = 220;
          cb = 255;
          alpha = 0.4 * ((m - 0.5) * 2) * twinkle;
        }
        if (alpha <= 0.01) continue;
        // sem ctx.shadowBlur (caríssimo no canvas 2D) — o blend "screen" + tamanho
        // pequeno já dá a sensação de luz suave a custo quase zero.
        ctx.beginPath();
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    if (!reduce) raf = requestAnimationFrame(draw);

    const onVis = () => {
      running = !document.hidden;
      if (running && !reduce) raf = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [morphRef]);

  return (
    <>
      {/* vinheta nas bordas (radial-gradient é mais barato que box-shadow
          gigante para repaint), themed via --accent */}
      <div
        className="pointer-events-none fixed inset-0 -z-[6]"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 50%, transparent 55%, color-mix(in srgb, var(--accent) 12%, transparent) 78%, color-mix(in srgb, var(--bg) 92%, black) 100%)",
        }}
      />
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 -z-[7]"
        aria-hidden="true"
      />
    </>
  );
}
