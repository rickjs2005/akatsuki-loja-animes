import type { Product } from "@/lib/products";
import { SkullIcon } from "@/components/icons";

/**
 * Selos do card: desconto (à esquerda) + raridade (prova honesta), e do lado
 * direito a marca de vilão e a categoria. Sem prova social fabricada.
 */
export function ProductBadges({
  product,
  disc,
}: {
  product: Product;
  /** Percentual de desconto (ou null quando não há). */
  disc: number | null;
}) {
  const isVillain = product.side === "villain";

  return (
    <>
      {/* badges esquerda: desconto + raridade */}
      <div className="absolute left-4 top-4 z-10 flex flex-col items-start gap-1.5">
        {disc && (
          <span className="rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-[0_0_18px_-2px_#dc2626]">
            -{disc}%
          </span>
        )}
        <span
          className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest"
          style={{
            background: `${product.hue}22`,
            color: product.hue,
            border: `1px solid ${product.hue}55`,
          }}
        >
          {product.rarity}
        </span>
      </div>

      {/* badges direita: vilão + categoria */}
      <div className="absolute right-4 top-4 z-10 flex flex-col items-end gap-1.5">
        {isVillain && (
          <span className="inline-flex items-center gap-1 rounded-full border border-red-500/50 bg-red-950/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-red-300">
            <SkullIcon size={12} /> Vilão
          </span>
        )}
        <span className="rounded-full border border-current/20 px-3 py-1 text-[10px] uppercase tracking-widest opacity-75">
          {product.category}
        </span>
      </div>
    </>
  );
}
