import { ImageResponse } from "next/og";

// Imagem Open Graph dinâmica (também usada como fallback para o card do Twitter).
// Convenção de arquivo do App Router: o Next injeta automaticamente as meta tags.
export const runtime = "edge";

export const alt =
  "AKATSUKI — Action Figures, Mangás e Colecionáveis de Anime";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 50% 30%, #2a0d0d 0%, #0a0a0a 60%, #000 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
          padding: 80,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 40,
            letterSpacing: 12,
            color: "#ff3b3b",
            textTransform: "uppercase",
          }}
        >
          暁 Loja de Animes
        </div>
        <div
          style={{
            fontSize: 110,
            fontWeight: 900,
            letterSpacing: 8,
            marginTop: 16,
            color: "#fff",
          }}
        >
          AKATSUKI
        </div>
        <div
          style={{
            fontSize: 38,
            marginTop: 24,
            maxWidth: 900,
            color: "rgba(255,255,255,0.82)",
            lineHeight: 1.3,
          }}
        >
          Action Figures, Mangás e Colecionáveis de Anime
        </div>
        <div
          style={{
            fontSize: 28,
            marginTop: 40,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          12x sem juros · Frete grátis acima de R$ 299 · Compra pelo WhatsApp
        </div>
      </div>
    ),
    { ...size }
  );
}
