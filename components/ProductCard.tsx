"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Product } from "@/lib/products";
import { waLink, buyMessage } from "@/lib/whatsapp";
import { ratingFor, installments, discountPct, freeShipping } from "@/lib/format";
import { auraFor } from "@/lib/aura";
import { useCart } from "./CartProvider";

function Stars({ value, hue }: { value: number; hue: string }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} de 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} className="relative inline-block text-[13px] leading-none">
            <span className="opacity-25">★</span>
            <span
              className="absolute left-0 top-0 overflow-hidden"
              style={{ width: `${fill * 100}%`, color: hue }}
            >
              ★
            </span>
          </span>
        );
      })}
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [burst, setBurst] = useState(false);
  const aura = auraFor(product);

  // partículas de energia que sobem na cor do personagem ao adicionar
  const sparks = useMemo(
    () =>
      Array.from({ length: 16 }, () => ({
        x: 4 + Math.random() * 92,
        size: 3 + Math.random() * 5,
        rise: 300 + Math.random() * 240,
        sway: (Math.random() - 0.5) * 46,
        dur: 1.0 + Math.random() * 0.65,
        delay: Math.random() * 0.35,
      })),
    []
  );

  const handleAdd = () => {
    add(product.id);
    setBurst(true);
    window.setTimeout(() => setBurst(false), 1500);
    // abre o carrinho depois da aura tocar, pra o usuário ver o produto dentro
    window.setTimeout(() => open(), 820);
  };

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [10, -10]), {
    stiffness: 150,
    damping: 18,
  });
  const ry = useSpring(useTransform(mx, [0, 1], [-10, 10]), {
    stiffness: 150,
    damping: 18,
  });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  const { add, open, items } = useCart();
  const inCart = items.some((l) => l.id === product.id);
  const href = waLink(buyMessage(product.name, product.anime, product.price));
  const disc = discountPct(product.price, product.oldPrice);
  const { stars, reviews } = ratingFor(product.id);
  const parc = installments(product.price);
  const frete = freeShipping(product.price);
  const isVillain = product.side === "villain";

  return (
    <motion.div
      className="relative h-[480px]"
      animate={burst ? { scale: [1, 1.05, 0.985, 1.02, 1], x: [0, -4, 4, -2, 0] } : { scale: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* aura persistente enquanto o item está no carrinho */}
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

      {/* burst de aura ao adicionar (cor do personagem) */}
      <AnimatePresence>
        {burst && (
          <>
            <motion.div
              key="aura-glow"
              aria-hidden
              className="pointer-events-none absolute -inset-3 rounded-[2rem]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: [0, 1, 0.7, 0], scale: [0.9, 1.05, 1.02, 1.08] }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{ boxShadow: `0 0 70px 10px ${aura}, inset 0 0 46px ${aura}`, border: `2px solid ${aura}` }}
            />
            <motion.div
              key="aura-ring"
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-3xl"
              initial={{ opacity: 0.85, scale: 0.92 }}
              animate={{ opacity: 0, scale: 1.32 }}
              transition={{ duration: 0.95, ease: "easeOut" }}
              style={{ border: `2px solid ${aura}` }}
            />
            {/* flash radial vindo de baixo (energia subindo) */}
            <motion.div
              key="aura-flash"
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.55, 0] }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              style={{ background: `radial-gradient(120% 80% at 50% 100%, ${aura}, transparent 65%)`, mixBlendMode: "screen" }}
            />
            {/* chamas de energia subindo na cor do personagem */}
            <div key="aura-sparks" aria-hidden className="pointer-events-none absolute inset-0">
              {sparks.map((s, i) => (
                <motion.span
                  key={i}
                  className="absolute bottom-2"
                  style={{ left: `${s.x}%`, transformOrigin: "center bottom", filter: `drop-shadow(0 0 ${s.size * 1.7}px ${aura})` }}
                  initial={{ opacity: 0, y: 0, scaleY: 0.5, scaleX: 0.7 }}
                  animate={{
                    opacity: [0, 1, 0.9, 0],
                    y: [-6, -s.rise],
                    x: [0, s.sway, 0],
                    scaleY: [0.6, 1.25, 0.95, 0.4],
                    scaleX: [0.75, 1, 0.85, 0.6],
                  }}
                  transition={{ duration: s.dur, delay: s.delay, ease: "easeOut" }}
                >
                  <svg width={s.size * 2.2} height={s.size * 3.6} viewBox="0 0 20 32" aria-hidden>
                    <path d="M10 0 C3 12 4 21 10 32 C16 21 17 12 10 0 Z" fill={aura} />
                    <path d="M10 8 C6.5 15 7 22 10 28 C13 22 13.5 15 10 8 Z" fill="#ffffff" opacity="0.55" />
                  </svg>
                </motion.span>
              ))}
            </div>
          </>
        )}
      </AnimatePresence>

      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          mx.set(0.5);
          my.set(0.5);
        }}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[color-mix(in_srgb,var(--fg)_10%,transparent)] glass [transform-style:preserve-3d]"
      >
      {/* glow border on hover */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 0 1px ${product.hue}88, 0 0 40px -8px ${product.hue}` }}
      />

      {/* ---- display stage (decorativo: não captura cliques; o 3D translateZ
              da imagem interceptava os botões em browsers com GPU) ---- */}
      <div className="pointer-events-none relative flex-1 overflow-hidden">
        {/* radial pedestal glow */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(120% 80% at 50% 18%, ${product.hue}33, transparent 60%)`,
            opacity: hovered ? 1 : 0.7,
          }}
        />
        {/* badges esquerda: desconto + raridade */}
        <div className="absolute left-4 top-4 z-10 flex flex-col items-start gap-1.5">
          {disc && (
            <span className="rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-[0_0_18px_-2px_#dc2626]">
              -{disc}%
            </span>
          )}
          <span
            className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest"
            style={{ background: `${product.hue}22`, color: product.hue, border: `1px solid ${product.hue}55` }}
          >
            {product.rarity}
          </span>
        </div>
        {/* badges direita: vilão + categoria */}
        <div className="absolute right-4 top-4 z-10 flex flex-col items-end gap-1.5">
          {isVillain && (
            <span className="rounded-full border border-red-500/50 bg-red-950/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-red-300">
              ☠ Vilão
            </span>
          )}
          <span className="rounded-full border border-current/20 px-3 py-1 text-[10px] uppercase tracking-widest opacity-60">
            {product.category}
          </span>
        </div>

        {product.image ? (
          <motion.img
            src={product.image}
            alt={product.name}
            draggable={false}
            style={{ translateZ: 60 }}
            animate={{ scale: hovered ? 1.08 : 1, y: hovered ? -6 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="absolute inset-0 mx-auto h-full w-full select-none object-contain p-6 drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)]"
          />
        ) : (
          // branded fallback (sem foto) — troque por foto real
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ translateZ: 40 } as any}>
            <span
              className="font-display text-[120px] leading-none"
              style={{ color: product.hue, textShadow: `0 0 50px ${product.hue}` }}
            >
              {product.kanji}
            </span>
            <span className="mt-2 rounded-full border border-current/20 px-3 py-1 text-[10px] uppercase tracking-widest opacity-50">
              Foto em breve
            </span>
          </div>
        )}

        {/* reflective floor */}
        <div
          className="absolute inset-x-0 bottom-0 h-24"
          style={{ background: `linear-gradient(to top, ${product.hue}22, transparent)` }}
        />
        {/* reflection sweep */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ background: `linear-gradient(105deg, transparent 35%, ${product.hue}26 50%, transparent 65%)` }}
          animate={hovered ? { x: ["-120%", "120%"] } : { x: "-120%" }}
          transition={{ duration: 1.1, ease: "easeInOut", repeat: hovered ? Infinity : 0, repeatDelay: 0.7 }}
        />
      </div>

      {/* ---- info ---- */}
      <div className="relative z-10 flex flex-col gap-2.5 p-5" style={{ background: "color-mix(in srgb, var(--bg) 55%, transparent)" }}>
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-lg font-semibold leading-tight">{product.name}</h3>
            <span className="shrink-0 text-[11px] uppercase tracking-widest opacity-55">{product.anime}</span>
          </div>
          <p className="mt-1 text-sm opacity-60">{product.tagline}</p>
        </div>

        {/* avaliação */}
        <div className="flex items-center gap-2">
          <Stars value={stars} hue={product.hue} />
          <span className="text-xs font-medium opacity-70">{stars.toFixed(1)}</span>
          <span className="text-xs opacity-45">({reviews} avaliações)</span>
        </div>

        <div className="flex flex-col">
          {product.oldPrice && (
            <span className="text-xs line-through opacity-40">de {product.oldPrice}</span>
          )}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold leading-none" style={{ color: product.hue }}>
              {product.price}
            </span>
            {frete && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
                ✓ Frete grátis
              </span>
            )}
          </div>
          <span className="mt-1 text-[11px] opacity-60">ou {parc}</span>
        </div>

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
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Adicionado!
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
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
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
              <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.748-.985zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
          </motion.a>
        </div>
      </div>
      </motion.div>
    </motion.div>
  );
}
