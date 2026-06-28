"use client";

import type { FC } from "react";
import { Reveal } from "../Reveal";
import {
  ShippingIcon,
  ShieldIcon,
  CardIcon,
  ChatIcon,
  type IconProps,
} from "@/components/icons";

const benefits: {
  Icon: FC<IconProps>;
  title: string;
  desc: string;
}[] = [
  { Icon: ShippingIcon, title: "Envio para todo o Brasil", desc: "Frete grátis acima de R$ 299" },
  { Icon: ShieldIcon, title: "Compra 100% segura", desc: "Pagamento protegido" },
  { Icon: CardIcon, title: "Parcele em até 12x", desc: "Sem juros no cartão" },
  { Icon: ChatIcon, title: "Atendimento humano", desc: "Direto no WhatsApp" },
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
            <span style={{ color: "var(--accent)" }} className="shrink-0">
              <b.Icon size={28} />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">{b.title}</p>
              <p className="text-xs opacity-75">{b.desc}</p>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
