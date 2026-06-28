"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { usePrefersReducedMotion } from "@/components/usePrefersReducedMotion";

/**
 * SmartImage — wrapper sobre next/image com skeleton shimmer + fade/blur-up.
 *
 * Comportamento:
 * - Enquanto a imagem carrega, mostra um skeleton (gradiente shimmer animado)
 *   sobreposto.
 * - Quando carrega, o skeleton some (opacity -> 0) e a imagem faz fade-in
 *   (opacity 0 -> 1) com um leve blur(8px) -> blur(0).
 * - Se `prefers-reduced-motion: reduce`, o skeleton fica ESTÁTICO (cor sólida
 *   sutil, sem animação) e a imagem aparece sem blur/transição.
 *
 * Uso com `fill`:
 *   O container recebe `position: relative` e `overflow: hidden`, mas NÃO tem
 *   dimensão própria — quem usa deve dar tamanho via `wrapperClassName`
 *   (ex.: "w-full h-48" ou "aspect-square w-full"), pois `<Image fill>` exige
 *   um pai posicionado e dimensionado.
 *
 * Uso com width/height:
 *   Passe `width` e `height` (em px). O container se ajusta ao conteúdo.
 */

type SmartImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  /** Classe aplicada ao <Image> (a imagem em si). */
  className?: string;
  /** Classe aplicada ao container relativo. */
  wrapperClassName?: string;
  priority?: boolean;
  draggable?: boolean;
  /** Estilo repassado ao <Image>. */
  style?: CSSProperties;
};

export function SmartImage({
  src,
  alt,
  fill = false,
  width,
  height,
  sizes,
  className,
  wrapperClassName,
  priority = false,
  draggable,
  style,
}: SmartImageProps) {
  const prefersReduced = usePrefersReducedMotion();
  const [loaded, setLoaded] = useState(false);

  const markLoaded = () => setLoaded(true);

  // Transição da imagem: sem animação quando reduce-motion.
  const imageStyle: CSSProperties = {
    ...style,
    opacity: loaded ? 1 : 0,
    ...(prefersReduced
      ? { transition: "none" }
      : {
          filter: loaded ? "blur(0px)" : "blur(8px)",
          transition: "opacity 0.5s ease, filter 0.5s ease",
        }),
  };

  return (
    <span
      className={`relative block overflow-hidden ${wrapperClassName ?? ""}`}
      style={fill ? undefined : { width, height }}
    >
      {/* Skeleton: shimmer animado, ou cor sólida sutil se reduce-motion. */}
      <span
        aria-hidden
        className={`smartimg-skeleton${prefersReduced ? "" : " smartimg-shimmer"}`}
        style={{
          position: "absolute",
          inset: 0,
          opacity: loaded ? 0 : 1,
          transition: prefersReduced ? "none" : "opacity 0.4s ease",
          pointerEvents: "none",
        }}
      />

      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        sizes={sizes}
        priority={priority}
        draggable={draggable}
        className={className}
        style={imageStyle}
        // onLoadingComplete cobre versões mais antigas; onLoad cobre as novas.
        onLoadingComplete={markLoaded}
        onLoad={markLoaded}
      />

      <style jsx>{`
        .smartimg-skeleton {
          background: color-mix(in srgb, var(--fg) 8%, transparent);
        }
        .smartimg-shimmer {
          background-image: linear-gradient(
            110deg,
            color-mix(in srgb, var(--fg) 8%, transparent) 0%,
            color-mix(in srgb, var(--fg) 16%, transparent) 50%,
            color-mix(in srgb, var(--fg) 8%, transparent) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </span>
  );
}

export default SmartImage;
