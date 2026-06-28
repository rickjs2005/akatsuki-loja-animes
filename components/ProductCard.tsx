"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import type { Product } from "@/lib/products";
import { waLink, buyMessage } from "@/lib/whatsapp";
import { installments, discountPct, freeShipping } from "@/lib/format";
import { auraFor } from "@/lib/aura";
import { useCart } from "./CartProvider";
import { ViewTransitionLink } from "./ViewTransitionLink";
import { CartIcon, CheckIcon, WhatsAppIcon } from "./icons";
import { ProductBadges } from "./product/ProductBadges";
import { PriceBlock } from "./product/PriceBlock";
import { AuraBurst } from "./product/AuraBurst";

export function ProductCard({ product }: { product: Product }) {
  const { add, items } = useCart();
  const [hovered, setHovered] = useState(false);
  const [burst, setBurst] = useState(false);
  const [toast, setToast] = useState(false);
  const aura = auraFor(product);

  const handleAdd = () => {
    add(product.id);
    setBurst(true);
    setToast(true);
    window.setTimeout(() => setBurst(false), 1500);
    // micro-toast não-intrusivo: não abrimos o drawer, o usuário segue comprando
    window.setTimeout(() => setToast(false), 1600);
  };

  const inCart = items.some((l) => l.id === product.id);
  const href = waLink(buyMessage(product.name, product.anime, product.price));
  const disc = discountPct(product.price, product.oldPrice);
  const parc = installments(product.price);
  const frete = freeShipping(product.price);

  return (
    <motion.div
      className="relative h-[480px]"
      animate={burst ? { scale: [1, 1.05, 0.985, 1.02, 1], x: [0, -4, 4, -2, 0] } : { scale: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* micro-toast não-intrusivo (não abre o carrinho) */}
      <AnimatePresence>
        {toast && (
          <motion.span
            className="pointer-events-none absolute left-1/2 top-3 z-30 -translate-x-1/2 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg"
            style={{ background: aura, boxShadow: `0 0 20px -4px ${aura}` }}
            initial={{ opacity: 0, y: -8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            role="status"
            aria-live="polite"
          >
            <span className="inline-flex items-center gap-1" style={{ color: "#0a0a0a" }}>
              <CheckIcon size={12} /> Adicionado ao carrinho
            </span>
          </motion.span>
        )}
      </AnimatePresence>

      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[color-mix(in_srgb,var(--fg)_10%,transparent)] glass"
      >
      {/* glow border on hover */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 0 1px ${product.hue}88, 0 0 40px -8px ${product.hue}` }}
      />

      {/* ---- display stage: link para a página do produto (elemento
              compartilhado da View Transition via view-transition-name) ---- */}
      <ViewTransitionLink
        href={`/produto/${product.id}`}
        aria-label={`Ver detalhes de ${product.name}`}
        className="relative block flex-1 overflow-hidden"
      >
        {/* radial pedestal glow */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(120% 80% at 50% 18%, ${product.hue}33, transparent 60%)`,
            opacity: hovered ? 1 : 0.7,
          }}
        />

        <ProductBadges product={product} disc={disc} />

        {product.image ? (
          <div className="absolute inset-0">
            <motion.div
              className="relative h-full w-full"
              style={{ viewTransitionName: `product-${product.id}` }}
              animate={{ scale: hovered ? 1.08 : 1, y: hovered ? -6 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              <Image
                fill
                sizes="(max-width:640px) 100vw, 25vw"
                className="object-contain p-6 select-none drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)]"
                alt={product.name}
                src={product.image}
                draggable={false}
                priority={false}
              />
            </motion.div>
          </div>
        ) : (
          // branded fallback (sem foto) — troque por foto real
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ viewTransitionName: `product-${product.id}` }}
          >
            <span
              className="font-display text-[120px] leading-none"
              style={{ color: product.hue, textShadow: `0 0 50px ${product.hue}` }}
            >
              {product.kanji}
            </span>
            <span className="mt-2 rounded-full border border-current/20 px-3 py-1 text-[10px] uppercase tracking-widest opacity-75">
              Foto em breve
            </span>
          </div>
        )}

        {/* reflective floor */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
          style={{ background: `linear-gradient(to top, ${product.hue}22, transparent)` }}
        />
        {/* reflection sweep — roda 1 vez por hover (sem repeat infinito) */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ background: `linear-gradient(105deg, transparent 35%, ${product.hue}26 50%, transparent 65%)` }}
          animate={hovered ? { x: ["-120%", "120%"] } : { x: "-120%" }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />
      </ViewTransitionLink>

      {/* ---- info ---- */}
      <div className="relative z-10 flex flex-col gap-2.5 p-5" style={{ background: "color-mix(in srgb, var(--bg) 55%, transparent)" }}>
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-lg font-semibold leading-tight">
              <ViewTransitionLink
                href={`/produto/${product.id}`}
                className="transition-colors hover:text-[var(--accent)]"
              >
                {product.name}
              </ViewTransitionLink>
            </h3>
            <span className="shrink-0 text-[11px] uppercase tracking-widest opacity-75">{product.anime}</span>
          </div>
          <p className="mt-1 text-sm opacity-75">{product.tagline}</p>
        </div>

        <PriceBlock product={product} parc={parc} frete={frete} />

        {/* ações */}
        <div className="mt-1 flex items-center gap-2">
          <motion.button
            onClick={handleAdd}
            whileTap={{ scale: 0.96 }}
            animate={burst ? { scale: [1, 1.04, 1] } : { scale: 1 }}
            className="flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition-colors"
            style={{
              background: burst ? aura : "var(--accent)",
              color: burst ? "#0a0a0a" : "#fff",
              boxShadow: `0 0 24px -8px ${burst ? aura : "var(--accent)"}`,
            }}
          >
            {burst ? (
              <>
                <CheckIcon size={16} />
                Adicionado!
              </>
            ) : (
              <>
                <CartIcon size={16} />
                Adicionar
              </>
            )}
          </motion.button>
          <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Comprar agora no WhatsApp"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-black shadow-[0_0_24px_-6px_#25D366] transition-shadow hover:shadow-[0_0_36px_-4px_#25D366]"
          >
            <WhatsAppIcon size={20} />
          </motion.a>
        </div>
      </div>
      </motion.div>

      {/* ===== AURA — renderizada POR CIMA do card (pointer-events-none,
              não bloqueia clique). ===== */}
      {inCart && !burst && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ boxShadow: `0 0 0 1px ${aura}66, 0 0 26px -4px ${aura}` }}
        />
      )}

      <AuraBurst aura={aura} active={burst} />
    </motion.div>
  );
}
