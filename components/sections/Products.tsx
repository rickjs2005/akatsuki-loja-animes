"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { products, collectibles } from "@/lib/products";
import { ProductCard } from "../ProductCard";
import { Reveal } from "../Reveal";
import { usePrefersReducedMotion } from "../usePrefersReducedMotion";

type Filter = "todos" | "herois" | "viloes" | "colecionaveis";

const tabs: { id: Filter; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "herois", label: "Heróis" },
  { id: "viloes", label: "Vilões" },
  { id: "colecionaveis", label: "Mangás & Acessórios" },
];

export function Products() {
  const [filter, setFilter] = useState<Filter>("todos");
  const reduced = usePrefersReducedMotion();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

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

  const onTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (index + dir + tabs.length) % tabs.length;
    setFilter(tabs[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="coleção" className="relative px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-10 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.5em] opacity-75">
            Loja · Figures · Mangás · Acessórios
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-6xl text-glow">
            ESCOLHA O SEU LADO
          </h2>
          <p className="mx-auto mt-5 max-w-xl opacity-75">
            Heróis lendários ou vilões temíveis — toque em{" "}
            <span className="font-semibold" style={{ color: "var(--accent)" }}>
              Comprar
            </span>{" "}
            e finalize pelo WhatsApp em segundos.
          </p>
        </Reveal>

        {/* Filtros — tablist acessível */}
        <div
          role="tablist"
          aria-label="Filtrar coleção"
          className="mb-12 flex flex-wrap items-center justify-center gap-2.5"
        >
          {tabs.map((t, i) => {
            const active = filter === t.id;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={active}
                aria-controls="products-grid"
                tabIndex={active ? 0 : -1}
                onClick={() => setFilter(t.id)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
                className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                  active ? "text-white" : "opacity-80 hover:opacity-100"
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
          id="products-grid"
          role="tabpanel"
          aria-labelledby={`tab-${filter}`}
          initial={reduced ? false : "hidden"}
          animate="show"
          variants={
            reduced ? undefined : { show: { transition: { staggerChildren: 0.06 } } }
          }
          className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4 [perspective:1400px]"
        >
          {list.map((p) => (
            <motion.div
              key={p.id}
              variants={
                reduced
                  ? undefined
                  : {
                      hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
                      show: { opacity: 1, y: 0, filter: "blur(0px)" },
                    }
              }
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>

        <p className="mt-10 text-center text-sm opacity-75">
          {list.length} produtos · novos lançamentos toda semana
        </p>
      </div>
    </section>
  );
}
