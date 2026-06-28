"use client";

import { motion } from "framer-motion";
import { RippleButton } from "../RippleButton";
import { useTheme } from "../ThemeProvider";
import { HeroEye } from "../eyes/HeroEye";
import { waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.5 } },
};
const item = {
  hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Hero() {
  const { theme } = useTheme();

  return (
    <section
      id="mundo"
      className="relative flex min-h-screen items-center overflow-hidden px-6 py-28 sm:px-10 lg:px-16"
    >
      <HeroEye />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-x-12 gap-y-16 lg:grid-cols-12">
        {/* Coluna esquerda — conteúdo editorial */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center lg:col-span-7 lg:text-left"
        >
          <motion.p
            variants={item}
            className="mb-6 text-xs uppercase tracking-[0.55em] text-muted"
          >
            {theme === "dark"
              ? "Loja de animes · Figures & Mangás"
              : "Expansão de Domínio · Seis Olhos"}
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display text-display-1 font-black text-glow display-balance"
          >
            DESPERTE
            <br />
            <span style={{ color: "var(--accent)" }}>SEU PODER</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted sm:text-lg lg:mx-0"
          >
            Action figures, mangás e colecionáveis dos seus animes favoritos —
            Naruto, One Piece, Dragon Ball, Jujutsu Kaisen e muito mais. Compra
            rápida e direta pelo <span className="font-semibold text-[var(--fg)]">WhatsApp</span>.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-12 flex flex-wrap items-center justify-center gap-5 lg:justify-start"
          >
            <RippleButton onClick={() => document.getElementById("coleção")?.scrollIntoView({ behavior: "smooth" })}>
              Explorar Coleção
            </RippleButton>
            <motion.a
              href={waLink("Olá! Vim pela loja AKATSUKI e quero ver os lançamentos. 🔥")}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="ripple btn-cine relative inline-flex items-center justify-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--fg)_25%,transparent)] px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-[var(--fg)] transition-all duration-300 hover:border-[var(--accent)] hover:shadow-[0_0_40px_-8px_var(--accent)]"
            >
              <WhatsAppIcon size={18} />
              Comprar pelo WhatsApp
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Coluna direita — espaço reservado para o olho-showcase (HeroEye) */}
        <div className="hidden lg:col-span-5 lg:block" aria-hidden="true" />
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 lg:left-16 lg:translate-x-0"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-6 items-start justify-center rounded-full border border-current/30 p-1.5"
        >
          <span className="h-2 w-1 rounded-full bg-current" />
        </motion.div>
      </motion.div>
    </section>
  );
}
