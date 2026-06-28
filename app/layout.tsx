import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PerfModeProvider } from "@/components/PerfModeProvider";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CartProvider } from "@/components/CartProvider";
import { CartDrawer } from "@/components/CartDrawer";
import { products, collectibles } from "@/lib/products";
import { parseBRL } from "@/lib/format";
import { WHATSAPP_DISPLAY } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/site";

const display = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-display",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const SITE_DESCRIPTION =
  "Action figures, mangás e colecionáveis de Naruto, One Piece, Dragon Ball, Jujutsu Kaisen e muito mais. Parcele em até 12x sem juros, frete grátis acima de R$ 299 e compra rápida pelo WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AKATSUKI — Action Figures, Mangás e Colecionáveis de Anime",
    template: "%s · AKATSUKI",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "action figure",
    "action figure anime",
    "mangá",
    "colecionáveis anime",
    "figures de anime",
    "loja de anime",
    "Naruto",
    "One Piece",
    "Dragon Ball",
    "Jujutsu Kaisen",
    "Demon Slayer",
    "Attack on Titan",
    "miniaturas",
    "AKATSUKI",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "AKATSUKI",
    title: "AKATSUKI — Action Figures, Mangás e Colecionáveis de Anime",
    description: SITE_DESCRIPTION,
    // A imagem é gerada por app/opengraph-image.tsx (convenção de arquivo do
    // App Router), que também alimenta automaticamente o card do Twitter.
  },
  twitter: {
    card: "summary_large_image",
    title: "AKATSUKI — Action Figures, Mangás e Colecionáveis de Anime",
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

// JSON-LD (Server Component): loja + lista dos primeiros produtos.
// Sem reviews/aggregateRating — não temos avaliações reais e não inventamos.
const featured = [...products, ...collectibles].slice(0, 12);

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "OnlineStore",
      "@id": `${SITE_URL}/#store`,
      name: "AKATSUKI",
      url: SITE_URL,
      telephone: WHATSAPP_DISPLAY,
      description: SITE_DESCRIPTION,
    },
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/#products`,
      name: "Catálogo AKATSUKI",
      itemListElement: featured.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: p.name,
          category: p.category,
          ...(p.image ? { image: `${SITE_URL}${p.image}` } : {}),
          offers: {
            "@type": "Offer",
            priceCurrency: "BRL",
            price: parseBRL(p.price),
            availability: "https://schema.org/InStock",
          },
        },
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <PerfModeProvider>
            <CartProvider>
              <SmoothScroll>{children}</SmoothScroll>
              <CartDrawer />
            </CartProvider>
          </PerfModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
