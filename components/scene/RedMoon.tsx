"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MOON_VERT, MOON_FRAG } from "./shaders";
import { useTheme } from "../ThemeProvider";

/** Lua vermelha do hero (leve). No tema claro vira uma esfera pálida. */
export function RedMoon() {
  const group = useRef<THREE.Group>(null!);
  const sphere = useRef<THREE.Mesh>(null!);
  const { morphRef } = useTheme();

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uPulse: { value: 0 }, uMorph: { value: 0 } }),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const m = morphRef.current;
    uniforms.uTime.value = t;
    uniforms.uPulse.value = 0.5 + 0.5 * Math.sin(t * 0.6);
    uniforms.uMorph.value = m;
    if (sphere.current) sphere.current.rotation.y = t * 0.03;
    if (group.current) group.current.position.y = 6 + m * 4;
  });

  return (
    <group ref={group} position={[0, 6, -18]}>
      <mesh ref={sphere}>
        <sphereGeometry args={[9, 48, 48]} />
        <shaderMaterial
          vertexShader={MOON_VERT}
          fragmentShader={MOON_FRAG}
          uniforms={uniforms}
        />
      </mesh>
      <mesh scale={1.25}>
        <sphereGeometry args={[9, 32, 32]} />
        <meshBasicMaterial
          color={"#8B0000"}
          transparent
          opacity={0.16}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <pointLight color={"#ff2a1a"} intensity={90} distance={70} decay={1.6} />
    </group>
  );
}
