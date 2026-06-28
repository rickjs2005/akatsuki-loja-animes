import type { Product } from "@/lib/products";
import { CheckIcon } from "@/components/icons";

/**
 * Bloco de preço: preço antigo riscado, preço atual (na cor do personagem),
 * selo de frete grátis e parcelamento.
 */
export function PriceBlock({
  product,
  parc,
  frete,
}: {
  product: Product;
  /** Texto de parcelamento já formatado (ex.: "12x de R$ 19,16 sem juros"). */
  parc: string;
  /** Se o produto tem frete grátis. */
  frete: boolean;
}) {
  return (
    <div className="flex flex-col">
      {product.oldPrice && (
        <span className="text-xs line-through opacity-75">de {product.oldPrice}</span>
      )}
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold leading-none" style={{ color: product.hue }}>
          {product.price}
        </span>
        {frete && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
            <CheckIcon size={11} /> Frete grátis
          </span>
        )}
      </div>
      <span className="mt-1 text-[11px] opacity-75">ou {parc}</span>
    </div>
  );
}
