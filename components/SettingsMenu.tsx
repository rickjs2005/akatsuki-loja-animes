"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePerfMode } from "./PerfModeProvider";
import { GearIcon, CheckIcon } from "./icons";

type PerfPref = "auto" | "full" | "lite";
const OPTIONS: { pref: PerfPref; label: string; hint: string }[] = [
  { pref: "auto", label: "Auto", hint: "Detecta o aparelho" },
  { pref: "full", label: "3D", hint: "Cena WebGL completa" },
  { pref: "lite", label: "Leve", hint: "Sem 3D, máx. fluidez" },
];

export function SettingsMenu() {
  const { mode, pref, setPref } = usePerfMode();
  const [open, setOpen] = useState(false);
  const [cursorOn, setCursorOn] = useState(true);

  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const radioRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // sincroniza o estado do cursor com a preferência persistida
  useEffect(() => {
    try {
      setCursorOn(localStorage.getItem("akatsuki-cursor") !== "off");
    } catch {}
  }, [open]);

  // Escape fecha + clique fora fecha + foco inicial / retorno de foco
  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    // foca o radio ativo ao abrir
    const idx = Math.max(0, OPTIONS.findIndex((o) => o.pref === pref));
    radioRefs.current[idx]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
      prevFocus?.focus?.();
    };
  }, [open, pref]);

  const onRadioKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const n = (i + 1) % OPTIONS.length;
      radioRefs.current[n]?.focus();
      setPref(OPTIONS[n].pref);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const n = (i - 1 + OPTIONS.length) % OPTIONS.length;
      radioRefs.current[n]?.focus();
      setPref(OPTIONS[n].pref);
    }
  };

  const toggleCursor = () => {
    window.dispatchEvent(new CustomEvent("akatsuki:cursor-toggle"));
    setCursorOn((v) => !v);
  };

  const status =
    pref === "auto"
      ? `Automático · ${mode === "full" ? "3D ativo" : "modo leve"}`
      : pref === "full"
      ? "3D sempre ativo"
      : "Modo leve sempre";

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        aria-label="Configurações"
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--fg)_20%,transparent)] glass transition-colors hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
          <GearIcon size={20} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="Configurações de experiência"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="glass absolute right-0 top-full z-50 mt-3 w-64 origin-top-right rounded-2xl p-4"
            style={{ background: "color-mix(in srgb, var(--bg) 85%, transparent)" }}
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] opacity-90">
              Desempenho
            </p>
            <p className="mb-3 text-[11px] text-muted">{status}</p>

            <div
              role="radiogroup"
              aria-label="Modo de desempenho"
              className="relative flex rounded-full border border-[color-mix(in_srgb,var(--fg)_14%,transparent)] p-1"
            >
              {OPTIONS.map((o, i) => {
                const active = pref === o.pref;
                return (
                  <button
                    key={o.pref}
                    ref={(el) => {
                      radioRefs.current[i] = el;
                    }}
                    role="radio"
                    aria-checked={active}
                    tabIndex={active ? 0 : -1}
                    title={o.hint}
                    onClick={() => setPref(o.pref)}
                    onKeyDown={(e) => onRadioKey(e, i)}
                    className={`relative flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none ${
                      active ? "text-white" : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="perf-pill"
                        className="absolute inset-0 -z-10 rounded-full"
                        style={{ background: "var(--accent)", boxShadow: "0 0 20px -6px var(--accent)" }}
                        transition={{ type: "spring", stiffness: 320, damping: 28 }}
                      />
                    )}
                    {o.label}
                  </button>
                );
              })}
            </div>

            <div className="my-3 h-px bg-[color-mix(in_srgb,var(--fg)_12%,transparent)]" />

            {/* bônus: cursor Esfera do Dragão (desktop) */}
            <button
              onClick={toggleCursor}
              role="switch"
              aria-checked={cursorOn}
              className="flex w-full items-center justify-between rounded-xl px-1 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <span className="flex flex-col items-start">
                <span className="font-medium">Cursor temático</span>
                <span className="text-[11px] text-muted">Esfera do Dragão (desktop)</span>
              </span>
              <span
                className="relative flex h-6 w-11 shrink-0 items-center rounded-full transition-colors"
                style={{
                  background: cursorOn
                    ? "var(--accent)"
                    : "color-mix(in srgb, var(--fg) 22%, transparent)",
                }}
              >
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className="absolute h-5 w-5 rounded-full bg-white"
                  style={{ left: cursorOn ? "auto" : 2, right: cursorOn ? 2 : "auto" }}
                />
              </span>
            </button>

            {pref !== "auto" && (
              <button
                onClick={() => setPref("auto")}
                className="mt-3 inline-flex items-center gap-1 text-[11px] text-muted hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <CheckIcon size={12} /> Voltar para automático
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
