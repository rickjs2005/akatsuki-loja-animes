"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "./CartProvider";
import { allProducts } from "@/lib/products";
import { parseBRL, formatBRL } from "@/lib/format";
import { waLink, orderMessage } from "@/lib/whatsapp";

export function CartDrawer() {
  const { items, isOpen, close, inc, dec, remove, clear } = useCart();

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
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            className="fixed right-0 top-0 z-[71] flex h-full w-full max-w-md flex-col glass"
            style={{ background: "color-mix(in srgb, var(--bg) 88%, transparent)" }}
          >
            <header className="flex items-center justify-between border-b border-current/10 px-6 py-5">
              <h3 className="font-display text-xl font-semibold">
                Seu carrinho
                <span className="ml-2 text-sm opacity-60">
                  ({lines.reduce((s, l) => s + l.qty, 0)})
                </span>
              </h3>
              <button
                onClick={close}
                aria-label="Fechar"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-current/15 hover:bg-current/10"
              >
                ✕
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-4" data-lenis-prevent>
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center opacity-60">
                  <span className="text-5xl">🛒</span>
                  <p>Seu carrinho está vazio.</p>
                  <button
                    onClick={close}
                    className="mt-2 rounded-full border border-current/20 px-5 py-2 text-sm hover:bg-current/10"
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
                        className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl"
                        style={{ background: `radial-gradient(circle at 50% 30%, ${p.hue}33, transparent 70%)` }}
                      >
                        {p.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.image} alt={p.name} className="h-full w-full object-contain" />
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
                            aria-label="Remover"
                            className="shrink-0 text-xs opacity-50 hover:opacity-100"
                          >
                            remover
                          </button>
                        </div>
                        <p className="text-xs opacity-55">{p.anime}</p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => dec(p.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-current/20 hover:bg-current/10"
                            >
                              −
                            </button>
                            <span className="w-5 text-center text-sm font-semibold">{qty}</span>
                            <button
                              onClick={() => inc(p.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-current/20 hover:bg-current/10"
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
                <div className="mb-1 flex items-center justify-between text-sm opacity-70">
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
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-bold text-black shadow-[0_0_30px_-6px_#25D366] transition-transform hover:scale-[1.02]"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
                    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.748-.985zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  Finalizar pedido no WhatsApp
                </a>
                <button
                  onClick={clear}
                  className="mt-3 w-full text-center text-xs opacity-50 hover:opacity-100"
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
