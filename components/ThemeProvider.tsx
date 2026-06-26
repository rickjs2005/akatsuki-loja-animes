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
};

const Ctx = createContext<ThemeCtx | null>(null);

export function useTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTheme must be used inside ThemeProvider");
  return v;
}

const DURATION = 2200; // ms — cinematic, never instant

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [morph, setMorph] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const morphRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const fromRef = useRef(0);
  const toRef = useRef(0);

  const animate = (now: number) => {
    const elapsed = now - startRef.current;
    const t = Math.min(elapsed / DURATION, 1);
    const eased = easeInOutCubic(t);
    const value = fromRef.current + (toRef.current - fromRef.current) * eased;
    morphRef.current = value;
    setMorph(value);
    document.documentElement.style.setProperty(
      "--transition-progress",
      value.toFixed(4)
    );
    if (t < 1) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      setIsTransitioning(false);
    }
  };

  const toggle = () => {
    if (isTransitioning) return;
    const next: Theme = theme === "dark" ? "light" : "dark";
    fromRef.current = morphRef.current;
    toRef.current = next === "light" ? 1 : 0;
    startRef.current = performance.now();
    setIsTransitioning(true);
    setTheme(next);
    // flip body data-theme at the visual midpoint for the color crossfade
    window.setTimeout(() => {
      document.body.dataset.theme = next === "light" ? "light" : "dark";
    }, DURATION * 0.45);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    document.body.dataset.theme = "dark";
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <Ctx.Provider
      value={{ theme, morph, isTransitioning, toggle, morphRef }}
    >
      {children}
    </Ctx.Provider>
  );
}
