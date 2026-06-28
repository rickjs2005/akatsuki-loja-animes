"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { AtmosphereLayer } from "@/components/AtmosphereLayer";
import { TransitionOverlay } from "@/components/TransitionOverlay";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { DragonBallCursor } from "@/components/DragonBallCursor";
import { Hero } from "@/components/sections/Hero";
import { Benefits } from "@/components/sections/Benefits";
import { Products } from "@/components/sections/Products";
import { Domain } from "@/components/sections/Domain";
import { Ritual } from "@/components/sections/Ritual";
import { usePerfMode } from "@/components/PerfModeProvider";

// 3D scene: client-only, lazily loaded for code-splitting / performance
const BackgroundCanvas = dynamic(
  () => import("@/components/scene/BackgroundCanvas").then((m) => m.BackgroundCanvas),
  { ssr: false }
);

export default function Home() {
  const { lite } = usePerfMode();

  return (
    <main id="top" className="relative">
      {/* fundo CSS temático (sempre presente). No modo full fica atrás do WebGL
          opaco; no modo lite é o fundo principal, junto da atmosfera 2D. */}
      <div
        className="pointer-events-none fixed inset-0 -z-[12]"
        style={{
          background:
            "radial-gradient(120% 90% at 80% -10%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 55%), radial-gradient(120% 90% at 0% 110%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 55%), var(--bg)",
        }}
      />

      {/* UM motor de fundo por modo (sem redundância):
          full → cena WebGL 3D; lite → atmosfera 2D leve. */}
      {lite ? <AtmosphereLayer /> : <BackgroundCanvas />}

      {/* vinheta nas bordas — barata e presente nos dois modos (legibilidade) */}
      <div
        className="pointer-events-none fixed inset-0 -z-[6]"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 50%, transparent 55%, color-mix(in srgb, var(--accent) 12%, transparent) 78%, color-mix(in srgb, var(--bg) 92%, black) 100%)",
        }}
      />

      <TransitionOverlay />
      <DragonBallCursor />
      <WhatsAppFab />
      <AnnouncementBar />
      <Navbar />

      {/* readability gradient over the 3D, themed via --bg */}
      <div
        className="pointer-events-none fixed inset-0 -z-[5]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 62%, color-mix(in srgb, var(--bg) 72%, transparent) 100%)",
        }}
      />

      <Hero />
      <Benefits />
      <Products />
      <Domain />
      <Ritual />
    </main>
  );
}
