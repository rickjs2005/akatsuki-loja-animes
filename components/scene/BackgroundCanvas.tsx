"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import { useRef } from "react";
import { SkyBackground } from "./SkyBackground";
import { RedMoon } from "./RedMoon";
import { OrbitParticles } from "./OrbitParticles";
import { Clouds } from "./Clouds";
import { usePointer } from "./usePointer";

function CameraRig({ pointer }: { pointer: ReturnType<typeof usePointer> }) {
  const { camera } = useThree();
  useFrame(() => {
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

  return (
    <div className="fixed inset-0 -z-10 h-screen w-screen">
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 1, 14], fov: 55, near: 0.1, far: 200 }}
      >
        <color attach="background" args={["#050505"]} />
        <SkyBackground pointer={smoothRef} />
        <ambientLight intensity={0.3} />
        <RedMoon />
        <Clouds />
        <OrbitParticles count={550} />
        <CameraRig pointer={pointer} />
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  );
}
