"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function WireForm() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * (Math.PI / 30); // ~6°/sec
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
  });

  return (
    <group ref={ref}>
      <mesh>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshBasicMaterial wireframe color="#E36F2A" transparent opacity={0.35} />
      </mesh>
      <mesh>
        <torusKnotGeometry args={[1, 0.18, 80, 12, 2, 3]} />
        <meshBasicMaterial wireframe color="#FAFAFA" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      dpr={[1, 1.5]}
      frameloop="always"
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.4} />
      <WireForm />
    </Canvas>
  );
}
