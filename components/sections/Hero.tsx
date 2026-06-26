"use client";

import { motion } from "framer-motion";
import { RippleButton } from "../RippleButton";
import { useTheme } from "../ThemeProvider";

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
      className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-4xl"
      >
        <motion.p
          variants={item}
          className="mb-6 text-xs uppercase tracking-[0.55em] opacity-70"
        >
          {theme === "dark"
            ? "Loja de animes · Figures & Mangás"
            : "Expansão de Domínio · Seis Olhos"}
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl md:text-8xl text-glow"
        >
          DESPERTE
          <br />
          <span style={{ color: "var(--accent)" }}>SEU PODER</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-8 max-w-xl text-base leading-relaxed opacity-75 sm:text-lg"
        >
          Action figures, mangás e colecionáveis dos seus animes favoritos —
          Naruto, One Piece, Dragon Ball, Jujutsu Kaisen e muito mais. Compra
          rápida e direta pelo <span className="font-semibold">WhatsApp</span>.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-12 flex flex-wrap items-center justify-center gap-5"
        >
          <RippleButton onClick={() => document.getElementById("coleção")?.scrollIntoView({ behavior: "smooth" })}>
            Explorar Coleção
          </RippleButton>
          <RippleButton variant="ghost" onClick={() => document.getElementById("domínio")?.scrollIntoView({ behavior: "smooth" })}>
            O Domínio
          </RippleButton>
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
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
