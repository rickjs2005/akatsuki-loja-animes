"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** stagger direct children instead of animating the wrapper as one block */
  stagger?: boolean;
};

export function Reveal({ children, className = "", delay = 0, stagger = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = stagger ? Array.from(el.children) : [el];

    // Garante visibilidade total (sem blur/transform) — usado no caminho
    // reduced-motion e como fallback de resiliência.
    const reveal = () => {
      gsap.set(targets, { opacity: 1, y: 0, filter: "none", scale: 1, clearProps: "filter" });
    };

    // reduced-motion: não anima, apenas mostra o conteúdo.
    if (reduced) {
      reveal();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    gsap.set(targets, { opacity: 0, y: 56, filter: "blur(14px)", scale: 0.97 });

    const tween = gsap.to(targets, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      duration: 1.1,
      delay,
      ease: "power3.out",
      stagger: stagger ? 0.12 : 0,
      scrollTrigger: {
        trigger: el,
        start: "top 82%",
        toggleActions: "play none none none",
      },
    });

    // Resiliência: se o ScrollTrigger não disparar (ex.: elemento já acima da
    // viewport, ou layout não recalculado), garante que o conteúdo não fique
    // invisível para sempre.
    ScrollTrigger.refresh();
    const fallback = window.setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const st = tween.scrollTrigger;
      const triggered = st ? st.progress > 0 : false;
      // já passou da viewport ou animação nunca rodou -> revela
      if (!triggered && rect.top < window.innerHeight) reveal();
    }, 1200);

    return () => {
      window.clearTimeout(fallback);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, stagger, reduced]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
