"use client";

const items = [
  "🔥 FRETE GRÁTIS acima de R$ 299",
  "💳 Parcele em até 12x sem juros",
  "📦 Envio para todo o Brasil",
  "💬 Atendimento rápido no WhatsApp",
  "✨ Produtos 100% colecionáveis",
];

export function AnnouncementBar() {
  // duplicado para o marquee parecer infinito
  const loop = [...items, ...items];
  return (
    <div className="fixed inset-x-0 top-0 z-[58] h-8 overflow-hidden border-b border-white/10 bg-[var(--accent)] text-white">
      <div className="flex h-full items-center whitespace-nowrap will-change-transform [animation:marquee_28s_linear_infinite]">
        {loop.map((t, i) => (
          <span
            key={i}
            className="mx-6 text-[11px] font-semibold uppercase tracking-[0.15em]"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
