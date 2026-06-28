import { StarIcon } from "@/components/icons";

/**
 * Avaliação em estrelas — componente REUTILIZÁVEL e parametrizado.
 *
 * IMPORTANTE: não está plugado a nenhuma fonte de dados no card hoje. Foi
 * mantido pronto para reativação quando houver avaliações REAIS (não
 * fabricadas). Renderiza estrelas cheias até `value` (arredondado) e o
 * restante vazias, usando `StarIcon` com `filled`.
 */
export function Stars({
  value,
  hue,
  size = 14,
  count,
}: {
  /** Nota de 0 a 5 (dado real). */
  value: number;
  /** Cor das estrelas cheias. */
  hue: string;
  /** Tamanho do ícone em px. */
  size?: number;
  /** Número de avaliações reais (opcional). */
  count?: number;
}) {
  const filledCount = Math.round(Math.max(0, Math.min(5, value)));

  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={`${value.toFixed(1)} de 5${count != null ? ` (${count} avaliações)` : ""}`}
    >
      <span className="flex items-center gap-0.5" style={{ color: hue }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            size={size}
            filled={i < filledCount}
            className={i < filledCount ? "" : "opacity-30"}
          />
        ))}
      </span>
      <span className="text-xs font-medium opacity-75">{value.toFixed(1)}</span>
      {count != null && (
        <span className="text-xs opacity-75">({count})</span>
      )}
    </div>
  );
}
