"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/usePrefersReducedMotion";

/**
 * Cursor custom em forma de Esfera do Dragão (4 estrelas).
 *
 * Acessibilidade / opt-out:
 * - NÃO ativa quando `prefers-reduced-motion: reduce`.
 * - NÃO ativa em telas sem ponteiro fino (touch).
 * - É OPCIONAL via localStorage na chave "akatsuki-cursor" ("on" | "off").
 *   Default (ausente) = "on".
 *
 * Alternar em runtime (de qualquer lugar do app):
 *   window.dispatchEvent(new CustomEvent("akatsuki:cursor-toggle"));
 * Isso inverte o estado (on <-> off), persiste no localStorage e
 * habilita/desabilita o cursor imediatamente (montando/desmontando rAF,
 * listeners e a classe `db-cursor` no <html>).
 */

const STORAGE_KEY = "akatsuki-cursor";
const TOGGLE_EVENT = "akatsuki:cursor-toggle";

type CursorPref = "on" | "off";

export function DragonBallCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const active = useRef(false);

  const prefersReduced = usePrefersReducedMotion();
  const [pref, setPref] = useState<CursorPref>("on");
  const [pointerFine, setPointerFine] = useState(false);

  // Leitura inicial (cliente): tipo de ponteiro + preferência salva.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia) {
      setPointerFine(window.matchMedia("(pointer: fine)").matches);
    }
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      setPref(stored === "off" ? "off" : "on");
    } catch {
      setPref("on");
    }
  }, []);

  // Toggle em runtime via evento de window. Persiste e inverte.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onToggle = () => {
      setPref((prev) => {
        const next: CursorPref = prev === "on" ? "off" : "on";
        try {
          window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
          /* ignora storage indisponível */
        }
        return next;
      });
    };
    window.addEventListener(TOGGLE_EVENT, onToggle);
    return () => window.removeEventListener(TOGGLE_EVENT, onToggle);
  }, []);

  // Só ativa com ponteiro fino, sem reduce-motion e com preferência "on".
  const enabled = pointerFine && !prefersReduced && pref === "on";

  // Efeito da esfera: adiciona a classe, monta rAF + listeners.
  // Toda a montagem/desmontagem é guiada por `enabled`, então alternar
  // em runtime monta/desmonta tudo automaticamente, sem vazamentos.
  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("db-cursor");

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      const el = e.target as HTMLElement | null;
      active.current = !!el?.closest?.("a, button, [role='button'], input, label");
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const loop = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.35;
      pos.current.y += (target.current.y - pos.current.y) * 0.35;
      ringPos.current.x += (target.current.x - ringPos.current.x) * 0.16;
      ringPos.current.y += (target.current.y - ringPos.current.y) * 0.16;
      const s = active.current ? 1.7 : 1;
      if (dot.current)
        dot.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%) scale(${s})`;
      if (ring.current)
        ring.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%) scale(${active.current ? 1.9 : 1})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("db-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* halo que segue com atraso */}
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[120] h-9 w-9 rounded-full"
        style={{
          border: "1px solid rgba(255,154,30,0.55)",
          boxShadow: "0 0 16px 2px rgba(255,138,30,0.35)",
        }}
      />
      {/* a esfera */}
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[121]"
        style={{ filter: "drop-shadow(0 0 8px rgba(255,138,30,0.8))" }}
      >
        <svg width="26" height="26" viewBox="0 0 100 100" aria-hidden>
          <defs>
            <radialGradient id="dbball" cx="38%" cy="32%" r="70%">
              <stop offset="0%" stopColor="#ffe8b0" />
              <stop offset="40%" stopColor="#ffab33" />
              <stop offset="100%" stopColor="#e8650e" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill="url(#dbball)" stroke="#c4530a" strokeWidth="2" />
          <ellipse cx="37" cy="30" rx="16" ry="9" fill="#fff" opacity="0.45" />
          {/* 4 estrelas vermelhas */}
          {[
            [37, 38],
            [63, 38],
            [37, 64],
            [63, 64],
          ].map(([x, y], i) => (
            <text
              key={i}
              x={x}
              y={y}
              fontSize="20"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#d61f1f"
            >
              ★
            </text>
          ))}
        </svg>
      </div>
    </>
  );
}
