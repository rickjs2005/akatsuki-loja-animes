"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "./CartProvider";
import { allProducts } from "@/lib/products";
import { parseBRL, formatBRL } from "@/lib/format";
import { waLink, orderMessage } from "@/lib/whatsapp";
import { WhatsAppIcon, CartIcon, CloseIcon } from "@/components/icons";

export function CartDrawer() {
  const { items, isOpen, close, inc, dec, remove, clear } = useCart();

  const asideRef = useRef<HTMLElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  // Escape fecha + focus trap (Tab/Shift+Tab) confinado ao aside.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "Tab") {
        const aside = asideRef.current;
        if (!aside) return;
        const focusables = aside.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (e.shiftKey) {
          if (active === first || !aside.contains(active)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last || !aside.contains(active)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  // Trava o scroll do body, guarda e restaura o foco ao abrir/fechar.
  useEffect(() => {
    if (!isOpen) return;

    prevFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Move o foco para dentro do dialog (botão fechar, ou o próprio aside).
    const focusTarget = closeBtnRef.current ?? asideRef.current;
    focusTarget?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      prevFocusRef.current?.focus?.();
    };
  }, [isOpen]);

  const lines = items
    .map((l) => {
      const p = allProducts.find((x) => x.id === l.id);
      return p ? { p, qty: l.qty } : null;
    })
    .filter(Boolean) as { p: (typeof allProducts)[number]; qty: number }[];

  const total = lines.reduce((s, l) => s + parseBRL(l.p.price) * l.qty, 0);
  const totalStr = formatBRL(total);

  const href = waLink(
    orderMessage(
      lines.map((l) => ({
        name: l.p.name,
        anime: l.p.anime,
        qty: l.qty,
        price: l.p.price,
      })),
      totalStr
    )
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            ref={asideRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            tabIndex={-1}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            className="fixed right-0 top-0 z-[71] flex h-full w-full max-w-md flex-col glass focus:outline-none"
            style={{ background: "color-mix(in srgb, var(--bg) 88%, transparent)" }}
          >
            <header className="flex items-center justify-between border-b border-current/10 px-6 py-5">
              <h3 id="cart-title" className="text-xl font-semibold tracking-tight">
                Seu carrinho
                <span className="ml-2 text-sm opacity-75">
                  ({lines.reduce((s, l) => s + l.qty, 0)})
                </span>
              </h3>
              <button
                ref={closeBtnRef}
                onClick={close}
                aria-label="Fechar"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-current/15 hover:bg-current/10 focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
              >
                <CloseIcon />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-4" data-lenis-prevent>
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center opacity-75">
                  <CartIcon size={44} className="opacity-60" />
                  <p>Seu carrinho está vazio.</p>
                  <button
                    onClick={close}
                    className="mt-2 rounded-full border border-current/20 px-5 py-2 text-sm hover:bg-current/10 focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
                  >
                    Continuar comprando
                  </button>
                </div>
              ) : (
                <ul className="flex flex-col gap-3">
                  {lines.map(({ p, qty }) => (
                    <li
                      key={p.id}
                      className="flex gap-3 rounded-2xl border border-current/10 p-3"
                    >
                      <div
                        className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl"
                        style={{ background: `radial-gradient(circle at 50% 30%, ${p.hue}33, transparent 70%)` }}
                      >
                        {p.image ? (
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            sizes="80px"
                            className="object-contain"
                          />
                        ) : (
                          <span className="font-display text-3xl" style={{ color: p.hue }}>
                            {p.kanji}
                          </span>
                        )}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate font-semibold leading-tight">{p.name}</p>
                          <button
                            onClick={() => remove(p.id)}
                            aria-label={`Remover ${p.name}`}
                            className="-mr-1 shrink-0 rounded-md px-2 py-1 text-xs opacity-75 hover:opacity-100 focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
                          >
                            remover
                          </button>
                        </div>
                        <p className="text-xs opacity-75">{p.anime}</p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => dec(p.id)}
                              aria-label={`Diminuir quantidade de ${p.name}`}
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-current/20 hover:bg-current/10 focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
                            >
                              −
                            </button>
                            <span className="w-5 text-center text-sm font-semibold">{qty}</span>
                            <button
                              onClick={() => inc(p.id)}
                              aria-label={`Aumentar quantidade de ${p.name}`}
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-current/20 hover:bg-current/10 focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-bold" style={{ color: p.hue }}>
                            {formatBRL(parseBRL(p.price) * qty)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <footer className="border-t border-current/10 px-6 py-5">
                <div className="mb-1 flex items-center justify-between text-sm opacity-75">
                  <span>Subtotal</span>
                  <span>{totalStr}</span>
                </div>
                <div className="mb-4 flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span style={{ color: "var(--accent)" }}>{totalStr}</span>
                </div>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-bold text-black shadow-[0_0_30px_-6px_#25D366] transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
                >
                  <WhatsAppIcon size={18} />
                  Finalizar pedido no WhatsApp
                </a>
                <button
                  onClick={clear}
                  className="mx-auto mt-3 block rounded-md px-2 py-1 text-center text-xs opacity-75 hover:opacity-100 focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
                >
                  Esvaziar carrinho
                </button>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
