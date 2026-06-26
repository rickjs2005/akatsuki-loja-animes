"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { PARTICLE_VERT, PARTICLE_FRAG } from "./shaders";
import { useTheme } from "../ThemeProvider";

export function OrbitParticles({ count = 1200 }: { count?: number }) {
  const pts = useRef<THREE.Points>(null!);
  const { morphRef } = useTheme();
  const { gl } = useThree();

  const { geometry, uniforms } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // distribute in a wide dome around the camera
      const r = 8 + Math.random() * 26;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.7 + 2;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 6;
      scales[i] = 0.4 + Math.random() * 1.2;
      seeds[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    const u = {
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
    };
    return { geometry: g, uniforms: u };
  }, [count, gl]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uMorph.value = morphRef.current;
    if (pts.current) pts.current.rotation.y = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={pts} geometry={geometry}>
      <shaderMaterial
        vertexShader={PARTICLE_VERT}
        fragmentShader={PARTICLE_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
