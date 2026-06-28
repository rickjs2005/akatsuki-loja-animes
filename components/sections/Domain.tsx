"use client";

import { Reveal } from "../Reveal";
import { useTheme } from "../ThemeProvider";
import { RippleButton } from "../RippleButton";

const features = [
  {
    k: "幻",
    title: "Tema Akatsuki",
    body: "Preto absoluto, fumaça volumétrica, partículas vermelhas e uma lua que pulsa como um ritual.",
  },
  {
    k: "界",
    title: "Expansão de Domínio",
    body: "Branco puro, azul neon, fractais e energia infinita. Outra dimensão a um clique.",
  },
  {
    k: "影",
    title: "Tudo é animado",
    body: "Nada aparece instantaneamente. Câmera, sombras e luz reagem ao seu movimento.",
  },
];

export function Domain() {
  const { theme, toggle, isTransitioning } = useTheme();

  return (
    <section id="domínio" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-6xl text-glow">
            DOIS MUNDOS, UM PORTAL
          </h2>
          <p className="mx-auto mt-5 max-w-2xl opacity-75">
            A troca entre Dark e Light é uma transformação cinematográfica — a
            lua se desfaz, a energia explode e o ambiente inteiro se reconstrói.
          </p>
          <div className="mt-9 flex justify-center">
            <RippleButton onClick={toggle} disabled={isTransitioning}>
              {theme === "dark" ? "Ativar Expansão de Domínio" : "Voltar ao Ritual"}
            </RippleButton>
          </div>
        </Reveal>

        <Reveal stagger className="mt-20 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-3xl glass p-8 transition-transform duration-500 hover:-translate-y-2"
            >
              <span
                className="font-display text-5xl"
                style={{ color: "var(--accent)", textShadow: "0 0 24px var(--accent)" }}
              >
                {f.k}
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed opacity-75">{f.body}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
