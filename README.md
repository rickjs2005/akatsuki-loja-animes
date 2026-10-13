**English** · [Português](README.pt-BR.md)

# 暁 AKATSUKI — Anime Store

A cinematic 3D anime store demo — **action figures, manga and collectibles** of anime heroes and villains, with checkout straight to **WhatsApp**. Red moon, particles, two themes (Akatsuki / Domain Expansion) and a **per-character energy aura** when an item is added to the cart. The UI is in Brazilian Portuguese.

> **Type:** fan-made commercial demo (portfolio project) · **Demo:** https://akatsuki-loja-animes.vercel.app
>
> **Disclaimer:** this is a **fan-made, unofficial** project. "AKATSUKI" is a fictional store brand. The characters, names, works and trademarks shown (Naruto, One Piece, Dragon Ball, Jujutsu Kaisen, Demon Slayer, Attack on Titan, etc.) belong to their respective rights holders; this project is **not affiliated with, sponsored or endorsed by** them. Products, prices, ratings and stock are **illustrative**.

![AKATSUKI store — catalog](docs/screenshots/store.png)

![AKATSUKI store — hero, dark theme](docs/screenshots/hero.webp)

---

## Features

- **Catalog** — 33 figures (18 heroes + 15 villains) and 8 collectibles (manga, miniatures and accessories), defined in `lib/products.ts`.
- **Product page** — `/produto/[id]`, statically generated for every item.
- **Cart** — add several items and check out everything in a **single WhatsApp message**; persisted in `localStorage`. Adding an item triggers the character's aura and opens the cart.
- **Direct purchase** — a WhatsApp button on each card with a prefilled message (product + price).
- **Filters** — All / Heroes / Villains / Manga & Accessories.
- **E-commerce look** — promo bar, benefits strip, discount badge, rating stars (illustrative values), 12-installment pricing and free-shipping tag.
- **Two cinematic themes** — *Akatsuki* (dark, red moon) ⇄ *Domain Expansion* (light, blue energy), with an animated transition.
- **Per-character energy aura** — when added to the cart, the card shakes/zooms and flames rise in the character's "lore" color (mapped in `lib/aura.ts`). While the item is in the cart, the card keeps a pulsing aura.
- **Performance panel** — Auto / 3D / Lite (lite mode disables WebGL on modest devices).
- **Dragon Ball cursor** — optional custom cursor (desktop).
- **3D scene** — moon, fog, particles and mouse parallax background.
- **SEO** — metadata, generated OpenGraph image (`app/opengraph-image.tsx`), `robots.txt`, `sitemap.xml` and JSON-LD.

## Stack

Next.js 14.2 (App Router) · React 18 · TypeScript · Tailwind CSS 3 · Three.js · React Three Fiber · drei · Framer Motion · GSAP · Lenis · GLSL shaders.

## Running locally

Requirements: Node.js 18.17+ (tested with Node 22) and npm.

```bash
npm ci
npm run dev      # http://localhost:3000
```

Production build:

```bash
npm run build && npm start
```

No environment variables are required.

> The 3D scene needs **WebGL with a GPU**. In GPU-less environments (some headless browsers) the 3D background may render black — open it in a regular browser or switch to Lite mode.

### Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (includes type checking) |
| `npm start` | Serve the production build |
| `npm run lint` | `next lint` — ESLint is **not configured** in this project yet |

## Customizing

### Site URL
`lib/site.ts` defines `SITE_URL`, used for canonical, OpenGraph, sitemap, robots and JSON-LD. Replace it with your domain.

### WhatsApp number
In the demo, purchase links point to MilWeb's business WhatsApp. To use your own, edit `lib/whatsapp.ts`:

```ts
export const WHATSAPP_NUMBER = "55DDNNNNNNNNN"; // country code + area code + number
export const WHATSAPP_DISPLAY = "(DD) NNNNN-NNNN";
```

### Products
Everything lives in `lib/products.ts`. Each product:

```ts
{
  id: "naruto",
  name: "Naruto Uzumaki",
  character: "Naruto Uzumaki",
  anime: "Naruto Shippuden",
  kanji: "渦",
  category: "Figure",            // Figure | Mangá | Miniatura | Acessório
  side: "hero",                  // hero | villain (optional)
  tagline: "O ninja que nunca desiste.",
  price: "R$ 189,90",
  oldPrice: "R$ 249,90",         // optional — renders the discount badge
  rarity: "Lendário",            // Comum | Raro | Lendário | Mítico
  hue: "#ff8a1e",                // card accent color
  image: "/characters/naruto.png", // optional — without it the card shows the kanji
}
```

### Images
- Characters: `public/characters/<id>.png` (transparent-background renders).
- Manga covers: `public/manga/<id>.jpg`.

Replace the file (same name) or point `image` to another path.

### Per-character aura
The aura color lives in `lib/aura.ts` (`auraFor`), keyed by product `id`; items not in the map fall back to the product `hue`. The animation lives in `components/ProductCard.tsx`.

## Project structure

```
app/                     # App Router (layout, page, produto/[id], OG image, robots, sitemap)
components/
  scene/                 # 3D scene (Canvas, moon, particles, clouds, GLSL shaders)
  sections/              # Hero, Benefits, Products, Domain, Ritual (footer)
  product/               # Product page (detail, price, badges, aura)
  eyes/                  # Animated theme eyes
  CartProvider / CartDrawer / CartButton   # Cart
  ProductCard            # Product card + per-character aura
  ThemeProvider / ThemeToggle / TransitionOverlay  # Themes + transition
  PerfModeProvider / SettingsMenu          # Performance mode
lib/
  products.ts            # Catalog
  aura.ts                # Aura color per character
  whatsapp.ts            # WhatsApp link and messages
  format.ts              # Price, installments, discount, rating
  site.ts                # Canonical URL
public/
  characters/            # Character images
  manga/                 # Manga covers
docs/screenshots/        # Screenshots used in this README
```

## Limitations

- No backend, payments, inventory or admin panel: an order is just a WhatsApp message.
- Prices, discounts and ratings are static and illustrative.
- No automated tests and no ESLint configuration.

## Image credits

The character images (`public/characters/`) and manga covers (`public/manga/`) are third-party artwork tied to the original works, used only as visual reference in this demo; the exact origin of the files is not documented. All rights belong to their respective holders. For any real use, replace them with your own or properly licensed images.

## Deployment

Built for [Vercel](https://vercel.com): import the repository — `npm run build` works with no extra configuration.

## Security

See [SECURITY.md](SECURITY.md).

## License

No license has been chosen yet; all rights reserved by the author. This applies only to the original code and design of this project — third-party characters and trademarks remain the property of their owners.
