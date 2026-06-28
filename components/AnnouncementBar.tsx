"use client";

import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const items = [
  "FRETE GRÁTIS acima de R$ 299",
  "Parcele em até 12x sem juros",
  "Envio para todo o Brasil",
  "Atendimento rápido no WhatsApp",
  "Produtos 100% colecionáveis",
];

export function AnnouncementBar() {
  const reduced = usePrefersReducedMotion();
  // duplicado para o marquee parecer infinito (só quando anima)
  const loop = reduced ? items : [...items, ...items];

  const textShadow = "0 1px 2px rgba(0,0,0,.45)";

  return (
    <div className="fixed inset-x-0 top-0 z-[58] h-8 overflow-hidden border-b border-white/10 bg-[var(--accent)] text-white">
      <div
        className={
          reduced
            ? "flex h-full items-center justify-center gap-6 overflow-x-auto whitespace-nowrap px-4"
            : "flex h-full items-center whitespace-nowrap will-change-transform [animation:marquee_28s_linear_infinite]"
        }
      >
        {loop.map((t, i) => (
          <span
            key={i}
            className={
              reduced
                ? "shrink-0 text-[11px] font-semibold uppercase tracking-[0.15em]"
                : "mx-6 text-[11px] font-semibold uppercase tracking-[0.15em]"
            }
            style={{ textShadow }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
