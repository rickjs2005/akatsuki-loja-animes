"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/lib/products";
import { allProducts } from "@/lib/products";
import { installments, discountPct, freeShipping } from "@/lib/format";
import { waLink, buyMessage } from "@/lib/whatsapp";
import { auraFor } from "@/lib/aura";
import { useCart } from "@/components/CartProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SettingsMenu } from "@/components/SettingsMenu";
import { CartButton } from "@/components/CartButton";
import { SmartImage } from "@/components/SmartImage";
import { ViewTransitionLink } from "@/components/ViewTransitionLink";
import { PriceBlock } from "./PriceBlock";
import {
  WhatsAppIcon,
  CartIcon,
  CheckIcon,
  SkullIcon,
  SparkleIcon,
} from "@/components/icons";

export function ProductDetail({ product }: { product: Product }) {
  const { add, items } = useCart();
  const [added, setAdded] = useState(false);
  const aura = auraFor(product);
  const isVillain = product.side === "villain";

  const disc = discountPct(product.price, product.oldPrice);
  const parc = installments(product.price);
  const frete = freeShipping(product.price);
  const inCart = items.some((l) => l.id === product.id);
  const href = waLink(buyMessage(product.name, product.anime, product.price));

  const related = allProducts
    .filter((p) => p.id !== product.id && p.anime === product.anime)
    .slice(0, 4);

  const handleAdd = () => {
    add(product.id);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="relative min-h-screen">
      {/* glow ambiente sutil na cor do personagem */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `radial-gradient(120% 90% at 80% 0%, ${product.hue}1f, transparent 55%)`,
        }}
      />

      {/* header próprio da PDP */}
      <header className="sticky top-0 z-40 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <ViewTransitionLink
          href="/"
          className="nav-link font-display text-lg font-bold tracking-[0.28em] text-glow"
        >
          暁 <span className="align-middle text-xs tracking-[0.4em] opacity-80">AKATSUKI</span>
        </ViewTransitionLink>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <SettingsMenu />
          <CartButton />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-28 pt-4">
        {/* breadcrumb / voltar */}
        <ViewTransitionLink
          href="/#coleção"
          className="text-muted mb-8 inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-100"
        >
          <span aria-hidden>←</span> Voltar para a coleção
        </ViewTransitionLink>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* ---- imagem (elemento compartilhado da transição) ---- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* pedestal glow */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background: `radial-gradient(110% 80% at 50% 22%, ${product.hue}33, transparent 62%)`,
              }}
            />
            <div
              className="relative mx-auto aspect-square w-full max-w-[520px]"
              style={{ viewTransitionName: `product-${product.id}` }}
            >
              {product.image ? (
                <SmartImage
                  fill
                  src={product.image}
                  alt={product.name}
                  sizes="(max-width:1024px) 100vw, 50vw"
                  priority
                  wrapperClassName="h-full w-full"
                  className="object-contain p-8 drop-shadow-[0_24px_44px_rgba(0,0,0,0.5)]"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className="font-display text-[180px] leading-none"
                    style={{ color: product.hue, textShadow: `0 0 70px ${product.hue}` }}
                  >
                    {product.kanji}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* ---- info ---- */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest"
                style={{ background: `${product.hue}22`, color: product.hue, border: `1px solid ${product.hue}55` }}
              >
                <SparkleIcon size={12} /> {product.rarity}
              </span>
              {isVillain && (
                <span className="inline-flex items-center gap-1 rounded-full border border-red-500/50 bg-red-950/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-red-300">
                  <SkullIcon size={12} /> Vilão
                </span>
              )}
              {disc && (
                <span className="rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white">
                  -{disc}%
                </span>
              )}
            </div>

            <p className="text-muted mb-2 text-xs uppercase tracking-[0.4em]">
              {product.anime} · {product.category}
            </p>
            <h1 className="display-balance text-4xl font-extrabold leading-[1.03] tracking-tight sm:text-5xl">
              {product.name}
            </h1>
            <p className="text-muted mt-5 max-w-md text-base leading-relaxed">
              {product.tagline}
            </p>

            <div className="mt-8">
              <PriceBlock product={product} parc={parc} frete={frete} />
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <motion.button
                onClick={handleAdd}
                whileTap={{ scale: 0.97 }}
                className="btn-cine flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold uppercase tracking-wide transition-colors"
                style={{
                  background: added ? aura : "var(--accent)",
                  color: added ? "#0a0a0a" : "#fff",
                  boxShadow: `0 0 30px -8px ${added ? aura : "var(--accent)"}`,
                }}
              >
                {added ? (
                  <>
                    <CheckIcon size={18} /> Adicionado!
                  </>
                ) : (
                  <>
                    <CartIcon size={18} /> Adicionar ao carrinho
                  </>
                )}
              </motion.button>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-black shadow-[0_0_30px_-8px_#25D366] transition-transform hover:scale-[1.03]"
              >
                <WhatsAppIcon size={18} /> Comprar agora
              </a>
            </div>

            <AnimatePresence>
              {inCart && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs"
                  style={{ color: aura }}
                  role="status"
                >
                  <CheckIcon size={13} /> Item no seu carrinho
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ---- relacionados ---- */}
        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Mais de {product.anime}
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {related.map((p) => (
                <ViewTransitionLink
                  key={p.id}
                  href={`/produto/${p.id}`}
                  className="group rounded-2xl glass p-4 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div
                    className="relative mx-auto aspect-square w-full"
                    style={{ viewTransitionName: `product-${p.id}` }}
                  >
                    {p.image ? (
                      <SmartImage
                        fill
                        src={p.image}
                        alt={p.name}
                        sizes="25vw"
                        wrapperClassName="h-full w-full"
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="font-display text-5xl" style={{ color: p.hue }}>
                          {p.kanji}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="mt-3 truncate text-center text-sm font-semibold">{p.name}</p>
                  <p className="text-center text-sm font-bold" style={{ color: p.hue }}>
                    {p.price}
                  </p>
                </ViewTransitionLink>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
