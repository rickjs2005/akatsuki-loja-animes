"use client";

export type Fx = "water" | "saiyan" | "leaves" | "none";

/** Decide o efeito pelo anime/série do produto. */
export function fxFor(text: string): Fx {
  const a = text.toLowerCase();
  if (a.includes("one piece") || a.includes("luffy") || a.includes("zoro")) return "water";
  if (a.includes("dragon ball") || a.includes("goku") || a.includes("vegeta") || a.includes("freeza") || a.includes("frieza"))
    return "saiyan";
  if (a.includes("naruto") || a.includes("uchiha") || a.includes("nagato") || a.includes("orochimaru") || a.includes("akatsuki"))
    return "leaves";
  return "none";
}

function Leaf({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <defs>
        <linearGradient id="lf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9fe08a" />
          <stop offset="55%" stopColor="#54b33d" />
          <stop offset="100%" stopColor="#256b2a" />
        </linearGradient>
      </defs>
      <path d="M12 1.5 C5.5 6.5 5.5 17 12 22.5 C18.5 17 18.5 6.5 12 1.5 Z" fill="url(#lf)" />
      <path d="M12 3 L12 21" stroke="#1f5c25" strokeWidth="0.7" opacity="0.7" />
      <path d="M12 8 L8.5 6 M12 8 L15.5 6 M12 13 L8 11.5 M12 13 L16 11.5" stroke="#1f5c25" strokeWidth="0.5" opacity="0.55" />
    </svg>
  );
}

function Bolt({ left, rot, delay, dur, scale }: { left: string; rot: string; delay: string; dur: string; scale: number }) {
  // raio principal (em ziguezague) + ramificações
  const main = "M30 0 L18 52 L34 62 L14 116 L30 128 L12 200";
  const branches = "M18 52 L2 78 M34 62 L50 92 M14 116 L0 144 M30 128 L46 156";
  return (
    <svg
      viewBox="0 0 60 200"
      preserveAspectRatio="none"
      className="absolute top-1 h-[85%]"
      style={{
        left,
        width: 44 * scale,
        transform: `translateX(-50%) rotate(${rot})`,
        animation: `fx-bolt ${dur} linear ${delay} infinite`,
        filter: "drop-shadow(0 0 5px #ffe35a) drop-shadow(0 0 13px rgba(255,200,40,0.95))",
      }}
      aria-hidden
    >
      {/* brilho largo */}
      <path d={main} fill="none" stroke="rgba(255,220,70,0.65)" strokeWidth="9" strokeLinejoin="round" strokeLinecap="round" />
      <path d={branches} fill="none" stroke="rgba(255,220,70,0.5)" strokeWidth="5" strokeLinecap="round" />
      {/* núcleo quente (branco) */}
      <path d={main} fill="none" stroke="#fffef2" strokeWidth="3.6" strokeLinejoin="round" strokeLinecap="round" />
      <path d={branches} fill="none" stroke="#fff7c8" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function Flame({ delay, left, w, h, hue }: { delay: number; left: string; w: number; h: number; hue: string }) {
  return (
    <span
      className="absolute bottom-0 origin-bottom"
      style={{ left, width: w, height: h, animation: `fx-flame ${0.5 + (delay % 0.4)}s ease-in-out ${delay}s infinite` }}
    >
      <svg viewBox="0 0 40 100" width={w} height={h} preserveAspectRatio="none" aria-hidden>
        <path d="M20 100 C2 70 8 48 20 0 C32 48 38 70 20 100 Z" fill={hue} />
      </svg>
    </span>
  );
}

/**
 * Overlay temático que só monta (e anima) quando `active` — não pesa em repouso.
 */
export function CardFx({ kind, active }: { kind: Fx; active: boolean }) {
  if (kind === "none" || !active) return null;

  if (kind === "water") {
    const waves = [
      { c: "rgba(36,120,200,0.55)", d: "11s", b: -4, h: 70, foam: false },
      { c: "rgba(43,150,255,0.5)", d: "8s", b: 4, h: 60, foam: false },
      { c: "rgba(90,200,255,0.5)", d: "6s", b: 12, h: 52, foam: true },
      { c: "rgba(150,235,255,0.55)", d: "4.5s", b: 20, h: 44, foam: true },
    ];
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* profundidade do mar */}
        <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: "linear-gradient(to top, rgba(10,80,160,0.45), rgba(20,120,200,0.15) 60%, transparent)" }} />
        {/* reflexos / cáusticas */}
        <div className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: "repeating-linear-gradient(100deg, transparent 0 14px, rgba(180,240,255,0.10) 14px 16px)", animation: "fx-caustic 3s ease-in-out infinite" }} />
        {waves.map((w, i) => (
          <svg key={i} viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute left-0 w-[200%]" style={{ bottom: w.b, height: w.h, animation: `fx-wave ${w.d} linear infinite` }}>
            <path d="M0,60 C150,110 350,10 600,60 C850,110 1050,10 1200,60 L1200,120 L0,120 Z" fill={w.c} />
            {w.foam && (
              <path d="M0,60 C150,110 350,10 600,60 C850,110 1050,10 1200,60" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="3" style={{ animation: "fx-foam 2.5s ease-in-out infinite" }} />
            )}
          </svg>
        ))}
        {/* respingos de espuma */}
        {[20, 40, 60, 78, 88].map((x, i) => (
          <span key={i} className="absolute h-1.5 w-1.5 rounded-full bg-white/80" style={{ left: `${x}%`, bottom: 22, animation: `fx-spray ${1.6 + (i % 3) * 0.5}s ease-out ${i * 0.45}s infinite` }} />
        ))}
      </div>
    );
  }

  if (kind === "saiyan") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* brilho dourado geral */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 60%, rgba(255,225,70,0.5), rgba(255,160,0,0.22) 55%, transparent 80%)", mixBlendMode: "screen", animation: "fx-aura 1.1s ease-in-out infinite" }} />
        {/* moldura/aura dourada */}
        <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 46px 8px rgba(255,205,40,0.7)", animation: "fx-aura 0.7s ease-in-out infinite" }} />
        {/* chamas da aura subindo */}
        {[
          { l: "8%", w: 26, h: 90, d: 0, hue: "rgba(255,150,0,0.55)" },
          { l: "24%", w: 34, h: 130, d: 0.15, hue: "rgba(255,200,30,0.6)" },
          { l: "45%", w: 40, h: 170, d: 0.05, hue: "rgba(255,235,120,0.6)" },
          { l: "66%", w: 34, h: 130, d: 0.22, hue: "rgba(255,200,30,0.6)" },
          { l: "84%", w: 26, h: 95, d: 0.1, hue: "rgba(255,150,0,0.55)" },
        ].map((f, i) => (
          <Flame key={i} delay={f.d} left={f.l} w={f.w} h={f.h} hue={f.hue} />
        ))}
        {/* faíscas de energia subindo */}
        {[16, 34, 52, 70, 86].map((x, i) => (
          <span key={i} className="absolute bottom-6 w-[2px] rounded-full" style={{ left: `${x}%`, height: 18, background: "linear-gradient(to top, transparent, #fff6b0)", animation: `fx-streak ${0.9 + (i % 3) * 0.3}s ease-in ${i * 0.25}s infinite` }} />
        ))}
        {/* clarão geral quando os raios estouram */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 45%, rgba(255,250,200,0.5), transparent 70%)", mixBlendMode: "screen", animation: "fx-bolt-glow 1.3s linear infinite" }} />
        {/* raios ramificados crepitando */}
        {[
          { x: "10%", r: "-12deg", d: "0s", dur: "1.3s", s: 0.95 },
          { x: "30%", r: "8deg", d: "0.45s", dur: "1.1s", s: 1.15 },
          { x: "50%", r: "-4deg", d: "0.2s", dur: "1.5s", s: 1.05 },
          { x: "70%", r: "10deg", d: "0.7s", dur: "1.2s", s: 1.15 },
          { x: "88%", r: "-8deg", d: "0.35s", dur: "1.4s", s: 0.95 },
        ].map((b, i) => (
          <Bolt key={i} left={b.x} rot={b.r} delay={b.d} dur={b.dur} scale={b.s} />
        ))}
      </div>
    );
  }

  // leaves (Naruto) — folhas girando e balançando
  const leaves = Array.from({ length: 9 }).map((_, i) => ({
    left: 6 + i * 10.5 + (i % 2) * 3,
    size: 11 + (i % 4) * 3,
    fall: 3.6 + (i % 5) * 0.7,
    sway: 2.2 + (i % 3) * 0.6,
    spin: 1.8 + (i % 4) * 0.5,
    delay: i * 0.4,
    dim: i % 3 === 0,
  }));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {leaves.map((lf, i) => (
        <span key={i} className="absolute top-0" style={{ left: `${lf.left}%`, animation: `fx-fall ${lf.fall}s linear ${lf.delay}s infinite`, opacity: lf.dim ? 0.5 : 1 }}>
          <span className="block" style={{ animation: `fx-sway ${lf.sway}s ease-in-out ${lf.delay}s infinite` }}>
            <span className="block origin-center" style={{ animation: `fx-spin ${lf.spin}s linear ${lf.delay}s infinite`, filter: lf.dim ? "blur(0.6px)" : "none" }}>
              <Leaf size={lf.size} />
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}
