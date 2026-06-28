"use client";

/**
 * Sharingan (clã Uchiha) — SVG puro, sem imagens raster.
 * Disco vermelho com pupila negra e três tomoe girando.
 *
 * Props:
 *  - animated: liga o giro lento dos tomoe (8–12s) e o pulso do glow.
 *  - spin: duração de uma volta dos tomoe, em segundos (default 11s).
 */
export function SharinganEye({
  className = "",
  animated = true,
  spin = 11,
  idSuffix = "",
}: {
  className?: string;
  animated?: boolean;
  spin?: number;
  idSuffix?: string;
}) {
  const irisId = `sh-iris-${idSuffix}`;
  const ringId = `sh-ring-${idSuffix}`;
  const glowId = `sh-glow-${idSuffix}`;

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient id={irisId} cx="50%" cy="46%" r="60%">
          <stop offset="0%" stopColor="#ff6a52" />
          <stop offset="32%" stopColor="#e21717" />
          <stop offset="70%" stopColor="#8b0000" />
          <stop offset="100%" stopColor="#3a0202" />
        </radialGradient>
        <radialGradient id={ringId} cx="50%" cy="50%" r="50%">
          <stop offset="78%" stopColor="rgba(0,0,0,0)" />
          <stop offset="92%" stopColor="rgba(140,0,0,0.55)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* tomoe desenhado na origem; vírgula com cabeça arredondada e cauda */}
        <g id={`tomoe-${idSuffix}`}>
          <path
            d="M 8.5,0 A 8.5,8.5 0 1,1 -8.5,0 C -8.5,9 -3,17 1,22 C 2,14 4.5,7 8.5,0 Z"
            fill="#070707"
          />
        </g>
      </defs>

      {/* disco base */}
      <circle cx="60" cy="60" r="58" fill="#0a0202" />
      <circle cx="60" cy="60" r="55" fill={`url(#${irisId})`} />
      <circle cx="60" cy="60" r="55" fill={`url(#${ringId})`} />

      {/* anel interno em volta da pupila */}
      <circle
        cx="60"
        cy="60"
        r="20"
        fill="none"
        stroke="#070707"
        strokeWidth="3.5"
      />

      {/* tomoe (giram em torno do centro) */}
      <g
        className={animated ? "uchiha-spin" : undefined}
        style={animated ? { animationDuration: `${spin}s` } : undefined}
        filter={`url(#${glowId})`}
      >
        <use href={`#tomoe-${idSuffix}`} transform="rotate(0 60 60) translate(60 26)" />
        <use href={`#tomoe-${idSuffix}`} transform="rotate(120 60 60) translate(60 26)" />
        <use href={`#tomoe-${idSuffix}`} transform="rotate(240 60 60) translate(60 26)" />
      </g>

      {/* pupila */}
      <circle cx="60" cy="60" r="11" fill="#050505" />
      <circle cx="56" cy="56" r="3" fill="rgba(255,120,100,0.5)" />
    </svg>
  );
}
