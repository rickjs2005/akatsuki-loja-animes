"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { SkyBackground } from "./SkyBackground";
import { RedMoon } from "./RedMoon";
import { OrbitParticles } from "./OrbitParticles";
import { Clouds } from "./Clouds";
import { usePointer } from "./usePointer";
import { usePrefersReducedMotion } from "../usePrefersReducedMotion";

/**
 * Em vez de renderizar a cada frame (até 120fps em telas rápidas), pede um
 * render no máximo a ~`fps` quadros/seg. Como o fundo é atmosférico e quase
 * estático, 30fps é indistinguível e corta o custo de GPU pela metade ou mais.
 * Roda em modo `frameloop="demand"`.
 */
function FrameThrottle({ fps, enabled }: { fps: number; enabled: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let last = 0;
    const interval = 1000 / fps;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last >= interval) {
        last = t;
        invalidate();
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [fps, enabled, invalidate]);
  return null;
}

function CameraRig({
  pointer,
  enabled,
}: {
  pointer: ReturnType<typeof usePointer>;
  enabled: boolean;
}) {
  const { camera } = useThree();
  useFrame(() => {
    if (!enabled) return; // reduced-motion: câmera estática, sem parallax
    pointer.smooth.current.x +=
      (pointer.target.current.x - pointer.smooth.current.x) * 0.05;
    pointer.smooth.current.y +=
      (pointer.target.current.y - pointer.smooth.current.y) * 0.05;
    camera.position.x += (pointer.smooth.current.x * 2.0 - camera.position.x) * 0.05;
    camera.position.y +=
      (pointer.smooth.current.y * 1.2 + 1 - camera.position.y) * 0.05;
    camera.lookAt(0, 1.5, -6);
  });
  return null;
}

export function BackgroundCanvas() {
  const pointer = usePointer();
  const smoothRef = useRef(pointer.smooth.current);
  const [active, setActive] = useState(true);
  const reduced = usePrefersReducedMotion();

  // pausa o render quando a aba não está visível (economia de GPU/CPU)
  useEffect(() => {
    const onVis = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // reduced-motion: 1 frame estático. Caso contrário, render sob demanda a 30fps
  // (frameloop "demand" + FrameThrottle) — muito mais leve que "always".
  const frameloop = reduced ? "never" : "demand";

  return (
    <div className="fixed inset-0 -z-10 h-screen w-screen">
      <Canvas
        frameloop={frameloop}
        onCreated={
          reduced
            ? ({ gl, scene, camera }) => gl.render(scene, camera)
            : undefined
        }
        gl={{
          antialias: false, // MSAA é caro sobre shader fullscreen; off no fundo
          alpha: false,
          powerPreference: "high-performance",
        }}
        // resolução travada em 1x: em telas retina (2x) isso reduz ~75% dos
        // fragmentos do shader fullscreen — o maior ganho isolado de GPU.
        dpr={1}
        camera={{ position: [0, 1, 14], fov: 55, near: 0.1, far: 200 }}
      >
        <color attach="background" args={["#050505"]} />
        <SkyBackground pointer={smoothRef} />
        <ambientLight intensity={0.3} />
        <RedMoon />
        <Clouds />
        <OrbitParticles count={120} />
        <CameraRig pointer={pointer} enabled={!reduced} />
        <FrameThrottle fps={30} enabled={active && !reduced} />
      </Canvas>
    </div>
  );
}
