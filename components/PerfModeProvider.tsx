"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * Modo de performance automático.
 *  - "full": cena WebGL 3D completa (shader, lua, nuvens, partículas).
 *  - "lite": sem WebGL — fica só a atmosfera 2D (canvas leve) + fundo CSS
 *            temático. Bem mais leve, garante 60fps em máquinas modestas.
 *
 * Decisão:
 *  1) preferência salva (localStorage "akatsuki-perf": auto | full | lite);
 *  2) sinais estáticos do aparelho (reduced-motion, save-data, pouca RAM/poucos
 *     núcleos, ponteiro coarse/mobile) → lite;
 *  3) watchdog de FPS (só em "auto"/"full"): se a média cair muito logo após
 *     montar, cai para lite e persiste (evita re-travar em visitas futuras).
 *
 * Override em runtime: window.dispatchEvent(new CustomEvent("akatsuki:perf-toggle"))
 * cicla full → lite → auto.
 */

type PerfMode = "full" | "lite";
type PerfPref = "auto" | "full" | "lite";

type Ctx = {
  mode: PerfMode;
  lite: boolean;
  pref: PerfPref;
  setPref: (p: PerfPref) => void;
  cyclePref: () => void;
};

const PerfCtx = createContext<Ctx | null>(null);
const KEY = "akatsuki-perf";

export function usePerfMode() {
  const v = useContext(PerfCtx);
  if (!v) throw new Error("usePerfMode deve ser usado dentro de PerfModeProvider");
  return v;
}

function readPref(): PerfPref {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "full" || v === "lite" || v === "auto") return v;
  } catch {}
  return "auto";
}

/** Heurística estática: aparelho provavelmente fraco para WebGL fullscreen? */
function detectLite(): boolean {
  if (typeof window === "undefined") return false;
  const mm = window.matchMedia?.bind(window);
  if (mm && mm("(prefers-reduced-motion: reduce)").matches) return true;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if (nav.connection?.saveData) return true;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4) return true;
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4)
    return true;
  // mobile / touch: GPUs costumam sofrer com o shader fullscreen
  if (mm && mm("(pointer: coarse)").matches) return true;
  return false;
}

function computeMode(pref: PerfPref): PerfMode {
  if (pref === "full") return "full";
  if (pref === "lite") return "lite";
  return detectLite() ? "lite" : "full"; // auto
}

export function PerfModeProvider({ children }: { children: React.ReactNode }) {
  // Lazy init no cliente evita montar o canvas pesado para depois remover.
  const [pref, setPrefState] = useState<PerfPref>(() =>
    typeof window === "undefined" ? "auto" : readPref()
  );
  const [mode, setMode] = useState<PerfMode>(() =>
    typeof window === "undefined" ? "full" : computeMode(readPref())
  );
  const watchdogDone = useRef(false);

  const setPref = useCallback((p: PerfPref) => {
    try {
      localStorage.setItem(KEY, p);
    } catch {}
    setPrefState(p);
    setMode(computeMode(p));
  }, []);

  const cyclePref = useCallback(() => {
    setPrefState((prev) => {
      const next: PerfPref =
        prev === "full" ? "lite" : prev === "lite" ? "auto" : "full";
      try {
        localStorage.setItem(KEY, next);
      } catch {}
      setMode(computeMode(next));
      return next;
    });
  }, []);

  // override por evento (escape hatch / futuro controle de UI)
  useEffect(() => {
    const onToggle = () => cyclePref();
    window.addEventListener("akatsuki:perf-toggle", onToggle);
    return () => window.removeEventListener("akatsuki:perf-toggle", onToggle);
  }, [cyclePref]);

  // watchdog de FPS — só quando em auto e rodando full; mede após o canvas
  // montar e, se a média ficar baixa, rebaixa para lite e persiste.
  useEffect(() => {
    if (pref !== "auto" || mode !== "full" || watchdogDone.current) return;

    let raf = 0;
    let frames = 0;
    let start = 0;
    const SAMPLE_MS = 2200;
    const FPS_FLOOR = 45;
    let warmupTimer = 0;

    const sample = (t: number) => {
      if (document.hidden) {
        // aba oculta falseia o rAF — reinicia a amostragem
        start = 0;
        frames = 0;
        raf = requestAnimationFrame(sample);
        return;
      }
      if (start === 0) start = t;
      frames++;
      const elapsed = t - start;
      if (elapsed < SAMPLE_MS) {
        raf = requestAnimationFrame(sample);
        return;
      }
      const fps = frames / (elapsed / 1000);
      watchdogDone.current = true;
      if (fps < FPS_FLOOR) {
        setMode("lite");
        try {
          localStorage.setItem(KEY, "lite"); // não re-travar na próxima visita
        } catch {}
        setPrefState("lite");
      }
    };

    // espera o canvas carregar/estabilizar antes de medir
    warmupTimer = window.setTimeout(() => {
      raf = requestAnimationFrame(sample);
    }, 1200);

    return () => {
      window.clearTimeout(warmupTimer);
      cancelAnimationFrame(raf);
    };
  }, [pref, mode]);

  return (
    <PerfCtx.Provider value={{ mode, lite: mode === "lite", pref, setPref, cyclePref }}>
      {children}
    </PerfCtx.Provider>
  );
}
