"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NOISE } from "./shaders";
import { useTheme } from "../ThemeProvider";

const CLOUD_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uMorph;
  uniform float uOffset;
  ${NOISE}
  void main(){
    vec2 uv = vUv;
    float n = fbm(vec3(uv*3.0 + vec2(uOffset, 0.0), uTime*0.05));
    float mask = smoothstep(0.0, 0.9, n);
    // soft edges
    float edge = smoothstep(0.0, 0.35, uv.x) * smoothstep(0.0, 0.35, 1.0-uv.x)
               * smoothstep(0.0, 0.35, uv.y) * smoothstep(0.0, 0.35, 1.0-uv.y);
    float a = mask * edge * (0.55 - uMorph*0.5);
    vec3 dark = vec3(0.03, 0.0, 0.0);
    vec3 light = vec3(0.8, 0.95, 1.0);
    vec3 col = mix(dark, light, uMorph);
    gl_FragColor = vec4(col, a);
  }
`;

const CLOUD_VERT = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function CloudPlane({ y, speed, scale, seed }: { y: number; speed: number; scale: number; seed: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  const { morphRef } = useTheme();
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uMorph: { value: 0 }, uOffset: { value: seed } }),
    [seed]
  );
  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uMorph.value = morphRef.current;
    if (ref.current) {
      ref.current.position.x += delta * speed;
      if (ref.current.position.x > 34) ref.current.position.x = -34;
    }
  });
  return (
    <mesh ref={ref} position={[seed * 18 - 18, y, -12]} scale={[scale, scale * 0.4, 1]}>
      <planeGeometry args={[20, 20]} />
      <shaderMaterial
        vertexShader={CLOUD_VERT}
        fragmentShader={CLOUD_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}

export function Clouds() {
  return (
    <group>
      <CloudPlane y={9} speed={0.6} scale={1.7} seed={0.2} />
      <CloudPlane y={4} speed={1.0} scale={1.3} seed={1.1} />
    </group>
  );
}
