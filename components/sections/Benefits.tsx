"use client";

import { Reveal } from "../Reveal";

const benefits = [
  { icon: "🚚", title: "Envio para todo o Brasil", desc: "Frete grátis acima de R$ 299" },
  { icon: "🔒", title: "Compra 100% segura", desc: "Pagamento protegido" },
  { icon: "💳", title: "Parcele em até 12x", desc: "Sem juros no cartão" },
  { icon: "💬", title: "Atendimento humano", desc: "Direto no WhatsApp" },
];

export function Benefits() {
  return (
    <section className="relative px-6 py-10">
      <Reveal
        stagger
        className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-4"
      >
        {benefits.map((b) => (
          <div
            key={b.title}
            className="flex items-center gap-3 rounded-2xl glass px-4 py-4"
          >
            <span className="text-2xl">{b.icon}</span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">{b.title}</p>
              <p className="text-xs opacity-60">{b.desc}</p>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
