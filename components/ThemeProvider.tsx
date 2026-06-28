"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type Theme = "dark" | "light";

type ThemeCtx = {
  theme: Theme;
  /** 0 = fully dark (Akatsuki), 1 = fully light (Domain). Animated. */
  morph: number;
  isTransitioning: boolean;
  toggle: () => void;
  /** read live morph value without re-rendering (for r3f frame loops) */
  morphRef: React.MutableRefObject<number>;
  /** incrementa a cada toque — reinicia a timeline coreografada do overlay */
  transitionKey: number;
  /** duração total da coreografia, em ms (compartilhada com o overlay) */
  duration: number;
};

const Ctx = createContext<ThemeCtx | null>(null);

export function useTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTheme must be used inside ThemeProvider");
  return v;
}

const DURATION = 1000; // ms — coreografia em 3 tempos (olho → cor → partículas)
const STORAGE_KEY = "akatsuki-theme";

// Easing mais acentuado no centro (quint): o grosso da troca de COR acontece no
// beat do meio — depois do "carregar" do olho e antes das partículas assentarem.
function easeInOutQuint(t: number) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
}

function prefersReduced() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [morph, setMorph] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);

  const morphRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const flipRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const fromRef = useRef(0);
  const toRef = useRef(0);

  const applyMorph = (value: number) => {
    morphRef.current = value;
    setMorph(value);
    document.documentElement.style.setProperty(
      "--transition-progress",
      value.toFixed(4)
    );
  };

  const animate = (now: number) => {
    const elapsed = now - startRef.current;
    const t = Math.min(elapsed / DURATION, 1);
    const eased = easeInOutQuint(t);
    applyMorph(fromRef.current + (toRef.current - fromRef.current) * eased);
    if (t < 1) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      setIsTransitioning(false);
    }
  };

  const toggle = () => {
    if (isTransitioning) return;
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}

    // Acessibilidade: quem pede menos movimento troca instantaneamente.
    if (prefersReduced()) {
      applyMorph(next === "light" ? 1 : 0);
      document.body.dataset.theme = next;
      return;
    }

    fromRef.current = morphRef.current;
    toRef.current = next === "light" ? 1 : 0;
    startRef.current = performance.now();
    setIsTransitioning(true);
    setTransitionKey((k) => k + 1); // reinicia a timeline do overlay

    // BEAT 2 (cor): vira o data-theme no meio, junto do "estouro" do morph.
    if (flipRef.current) window.clearTimeout(flipRef.current);
    flipRef.current = window.setTimeout(() => {
      document.body.dataset.theme = next;
    }, DURATION * 0.5);

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
  };

  // init: restaura preferência salva (sem animação no primeiro paint)
  useEffect(() => {
    let stored: Theme | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    } catch {}
    const initial: Theme = stored === "light" ? "light" : "dark";
    const target = initial === "light" ? 1 : 0;
    setTheme(initial);
    setMorph(target);
    morphRef.current = target;
    document.documentElement.style.setProperty(
      "--transition-progress",
      target.toFixed(4)
    );
    document.body.dataset.theme = initial;
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (flipRef.current) window.clearTimeout(flipRef.current);
    };
  }, []);

  return (
    <Ctx.Provider
      value={{
        theme,
        morph,
        isTransitioning,
        toggle,
        morphRef,
        transitionKey,
        duration: DURATION,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
