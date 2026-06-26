"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { products, collectibles } from "@/lib/products";
import { ProductCard } from "../ProductCard";
import { Reveal } from "../Reveal";

type Filter = "todos" | "herois" | "viloes" | "colecionaveis";

const tabs: { id: Filter; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "herois", label: "Heróis" },
  { id: "viloes", label: "Vilões" },
  { id: "colecionaveis", label: "Mangás & Acessórios" },
];

export function Products() {
  const [filter, setFilter] = useState<Filter>("todos");

  const list = useMemo(() => {
    const heroes = products.filter((p) => p.side !== "villain");
    const villains = products.filter((p) => p.side === "villain");
    switch (filter) {
      case "herois":
        return heroes;
      case "viloes":
        return villains;
      case "colecionaveis":
        return collectibles;
      default:
        return [...products, ...collectibles];
    }
  }, [filter]);

  return (
    <section id="coleção" className="relative px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-10 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.5em] opacity-60">
            Loja · Figures · Mangás · Acessórios
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-6xl text-glow">
            ESCOLHA O SEU LADO
          </h2>
          <p className="mx-auto mt-5 max-w-xl opacity-70">
            Heróis lendários ou vilões temíveis — toque em{" "}
            <span className="font-semibold text-[#25D366]">Comprar</span> e
            finalize pelo WhatsApp em segundos.
          </p>
        </Reveal>

        {/* Filtros */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-2.5">
          {tabs.map((t) => {
            const active = filter === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setFilter(t.id)}
                className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                  active ? "text-white" : "opacity-70 hover:opacity-100"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 -z-10 rounded-full"
                    style={{ background: "var(--accent)", boxShadow: "0 0 28px -6px var(--accent)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  />
                )}
                {!active && (
                  <span className="absolute inset-0 -z-10 rounded-full border border-current/15 glass" />
                )}
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Grade */}
        <motion.div
          key={filter}
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4 [perspective:1400px]"
        >
          {list.map((p) => (
            <motion.div
              key={p.id}
              variants={{
                hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
                show: { opacity: 1, y: 0, filter: "blur(0px)" },
              }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>

        <p className="mt-10 text-center text-sm opacity-50">
          {list.length} produtos · novos lançamentos toda semana
        </p>
      </div>
    </section>
  );
}
