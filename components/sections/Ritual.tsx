"use client";

import { Reveal } from "../Reveal";
import { RippleButton } from "../RippleButton";

export function Ritual() {
  return (
    <section id="ritual" className="relative px-6 py-40">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.5em] opacity-75">
          Sua coleção começa aqui
        </p>
        <h2 className="font-display text-4xl font-black leading-tight tracking-tight sm:text-7xl text-glow">
          MONTE A SUA
          <br />COLEÇÃO LENDÁRIA
        </h2>
        <p className="mx-auto mt-7 max-w-xl opacity-75">
          Figures, mangás e colecionáveis dos maiores animes. Escolha seus
          favoritos e finalize tudo em segundos pelo WhatsApp.
        </p>
        <div className="mt-10 flex justify-center">
          <RippleButton onClick={() => document.getElementById("coleção")?.scrollIntoView({ behavior: "smooth" })}>
            Ver a coleção
          </RippleButton>
        </div>
      </Reveal>

      <footer className="mx-auto mt-32 max-w-7xl border-t border-current/10 pt-10 text-center text-xs uppercase tracking-[0.3em] opacity-75">
        暁 AKATSUKI · Loja de animes · {new Date().getFullYear()}
      </footer>
    </section>
  );
}
