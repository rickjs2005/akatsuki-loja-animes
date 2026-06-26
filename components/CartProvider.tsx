"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type CartLine = { id: string; qty: number };

type CartCtx = {
  items: CartLine[];
  count: number;
  isOpen: boolean;
  add: (id: string) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "akatsuki-cart";

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used inside CartProvider");
  return v;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const hydrated = useRef(false);

  // hydrate from localStorage (uma vez)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    hydrated.current = true;
  }, []);

  // persiste só depois de hidratar (não sobrescreve o storage no 1º render)
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add = useCallback((id: string) => {
    setItems((prev) => {
      const found = prev.find((l) => l.id === id);
      if (found) return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { id, qty: 1 }];
    });
    // quem abre o drawer é o ProductCard (após a aura tocar) — assim o feedback
    // visual da aura não fica escondido atrás do carrinho.
  }, []);

  const inc = useCallback((id: string) => {
    setItems((prev) => prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)));
  }, []);

  const dec = useCallback((id: string) => {
    setItems((prev) =>
      prev
        .map((l) => (l.id === id ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0)
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const count = useMemo(() => items.reduce((s, l) => s + l.qty, 0), [items]);

  return (
    <Ctx.Provider
      value={{ items, count, isOpen, add, inc, dec, remove, clear, open, close }}
    >
      {children}
    </Ctx.Provider>
  );
}
