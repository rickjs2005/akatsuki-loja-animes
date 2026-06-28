"use client";

/**
 * Seis Olhos (Satoru Gojo / Expansão de Domínio) — SVG puro.
 * Íris azul detalhada com estrias radiais, anel holográfico e pulso suave.
 *
 * Props:
 *  - animated: liga rotação lenta da íris, pulso do glow e shimmer holográfico.
 *  - spin: duração de uma volta da íris, em segundos (default 26s — quase imperceptível).
 */
export function SixEyesEye({
  className = "",
  animated = true,
  spin = 26,
  idSuffix = "",
}: {
  className?: string;
  animated?: boolean;
  spin?: number;
  idSuffix?: string;
}) {
  const irisId = `gj-iris-${idSuffix}`;
  const haloId = `gj-halo-${idSuffix}`;
  const holoId = `gj-holo-${idSuffix}`;
  const glowId = `gj-glow-${idSuffix}`;

  // estrias da íris geradas proceduralmente (detalhe sem peso)
  const striae = Array.from({ length: 56 }, (_, i) => {
    const a = (i / 56) * Math.PI * 2;
    const r1 = 13;
    const r2 = 47 + ((i * 37) % 9);
    return (
      <line
        key={i}
        x1={60 + Math.cos(a) * r1}
        y1={60 + Math.sin(a) * r1}
        x2={60 + Math.cos(a) * r2}
        y2={60 + Math.sin(a) * r2}
        stroke="rgba(190,243,255,0.5)"
        strokeWidth={i % 2 ? 0.6 : 1.1}
      />
    );
  });

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient id={irisId} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#eafcff" />
          <stop offset="22%" stopColor="#8fe6ff" />
          <stop offset="52%" stopColor="#2b9bff" />
          <stop offset="82%" stopColor="#1450c8" />
          <stop offset="100%" stopColor="#06224f" />
        </radialGradient>
        <radialGradient id={haloId} cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="rgba(61,240,255,0)" />
          <stop offset="88%" stopColor="rgba(61,240,255,0.45)" />
          <stop offset="100%" stopColor="rgba(61,240,255,0)" />
        </radialGradient>
        <linearGradient id={holoId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(180,120,255,0.55)" />
          <stop offset="50%" stopColor="rgba(61,240,255,0.0)" />
          <stop offset="100%" stopColor="rgba(120,255,220,0.55)" />
        </linearGradient>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id={`gj-clip-${idSuffix}`}>
          <circle cx="60" cy="60" r="50" />
        </clipPath>
      </defs>

      {/* esfera base */}
      <circle cx="60" cy="60" r="52" fill="#04132e" />
      <circle cx="60" cy="60" r="50" fill={`url(#${irisId})`} />

      {/* estrias + shimmer holográfico (recortados na íris) */}
      <g clipPath={`url(#gj-clip-${idSuffix})`}>
        <g
          className={animated ? "gojo-iris" : undefined}
          style={animated ? { animationDuration: `${spin}s` } : undefined}
        >
          {striae}
        </g>
        <rect
          x="10"
          y="10"
          width="100"
          height="100"
          fill={`url(#${holoId})`}
          className={animated ? "gojo-holo" : undefined}
          style={{ mixBlendMode: "screen" }}
        />
      </g>

      {/* halo externo */}
      <circle cx="60" cy="60" r="50" fill={`url(#${haloId})`} />

      {/* pupila + brilho especular */}
      <circle cx="60" cy="60" r="12" fill="#02153a" filter={`url(#${glowId})`} />
      <circle cx="60" cy="60" r="12" fill="none" stroke="rgba(190,243,255,0.7)" strokeWidth="1.2" />
      <circle cx="55" cy="54" r="4.5" fill="#ffffff" opacity="0.92" />
      <circle cx="66" cy="67" r="2" fill="rgba(190,243,255,0.8)" />
    </svg>
  );
}
