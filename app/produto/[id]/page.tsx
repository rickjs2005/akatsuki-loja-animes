import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allProducts, getProduct } from "@/lib/products";
import { parseBRL } from "@/lib/format";
import { SITE_URL } from "@/lib/site";
import { ProductDetail } from "@/components/product/ProductDetail";

// Pré-gera todas as páginas de produto no build (SSG → rápido e ótimo p/ SEO).
export function generateStaticParams() {
  return allProducts.map((p) => ({ id: p.id }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const product = getProduct(params.id);
  if (!product) return { title: "Produto não encontrado" };

  const title = `${product.name} — ${product.anime}`;
  const description = `${product.tagline} ${product.category} de ${product.anime} por ${product.price}. Parcele em até 12x sem juros e finalize pelo WhatsApp.`;
  const url = `/produto/${product.id}`;
  const image = product.image ? `${SITE_URL}${product.image}` : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      ...(image ? { images: [{ url: image, alt: product.name }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    category: product.category,
    description: product.tagline,
    ...(product.image ? { image: `${SITE_URL}${product.image}` } : {}),
    brand: { "@type": "Brand", name: product.anime },
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: parseBRL(product.price),
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/produto/${product.id}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} />
    </>
  );
}
