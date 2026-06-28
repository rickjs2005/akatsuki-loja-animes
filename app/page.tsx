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

// 3D scene: client-only, lazily loaded for code-splitting / performance
const BackgroundCanvas = dynamic(
  () => import("@/components/scene/BackgroundCanvas").then((m) => m.BackgroundCanvas),
  { ssr: false }
);

export default function Home() {
  return (
    <main id="top" className="relative">
      <BackgroundCanvas />
      <AtmosphereLayer />
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
