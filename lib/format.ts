// Helpers de e-commerce: preço, parcelamento, desconto, avaliação

export function parseBRL(v: string): number {
  // "R$ 229,90" -> 229.90
  const n = v.replace(/[^\d,]/g, "").replace(".", "").replace(",", ".");
  return parseFloat(n) || 0;
}

export function formatBRL(n: number): string {
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/** "12x de R$ 19,16 sem juros" */
export function installments(price: string, n = 12): string {
  const total = parseBRL(price);
  const per = total / n;
  return `${n}x de ${formatBRL(per)} sem juros`;
}

export function discountPct(price: string, oldPrice?: string): number | null {
  if (!oldPrice) return null;
  const p = parseBRL(price);
  const o = parseBRL(oldPrice);
  if (!o || o <= p) return null;
  return Math.round((1 - p / o) * 100);
}

/** rating determinístico (sem hydration mismatch) a partir do id */
export function ratingFor(id: string): { stars: number; reviews: number } {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const stars = 4.5 + (h % 6) / 10; // 4.5 .. 5.0
  const reviews = 28 + (h % 372); // 28 .. 399
  return { stars: Math.min(5, stars), reviews };
}

export function freeShipping(price: string, threshold = 299): boolean {
  return parseBRL(price) >= threshold;
}
