"use client";

import { ContactShadows, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type RobotAvatarProps = {
  onActivate: () => void;
};

function RobotModel() {
  const groupRef = useRef<THREE.Group>(null);
  const elapsedRef = useRef(0);
  const [hovered, setHovered] = useState(false);
  const pointer = useThree((state) => state.pointer);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const safeDelta = Math.min(delta, 0.1);
    elapsedRef.current += safeDelta;
    const smoothing = 1 - Math.exp(-safeDelta * 7);

    group.position.y = THREE.MathUtils.lerp(
      group.position.y,
      Math.sin(elapsedRef.current * 1.65) * 0.09,
      smoothing,
    );
    group.rotation.y = THREE.MathUtils.lerp(
      group.rotation.y,
      hovered ? pointer.x * 0.28 : 0,
      smoothing,
    );
    group.rotation.x = THREE.MathUtils.lerp(
      group.rotation.x,
      hovered ? -pointer.y * 0.16 : 0,
      smoothing,
    );
  });

  return (
    <group
      ref={groupRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      scale={0.88}
    >
      <RoundedBox args={[1.46, 1.18, 0.94]} radius={0.26} smoothness={5} position={[0, 0.43, 0]}>
        <meshStandardMaterial color="#f3f4f6" roughness={0.78} metalness={0.06} />
      </RoundedBox>
      <RoundedBox args={[1.16, 0.76, 0.08]} radius={0.17} smoothness={5} position={[0, 0.45, 0.495]}>
        <meshStandardMaterial color="#030303" roughness={0.2} metalness={0.34} />
      </RoundedBox>
      <RoundedBox args={[0.2, 0.2, 0.055]} radius={0.025} smoothness={3} position={[-0.27, 0.47, 0.55]}>
        <meshStandardMaterial color="#ef233c" emissive="#ef233c" emissiveIntensity={0.9} toneMapped={false} />
      </RoundedBox>
      <RoundedBox args={[0.2, 0.2, 0.055]} radius={0.025} smoothness={3} position={[0.27, 0.47, 0.55]}>
        <meshStandardMaterial color="#ef233c" emissive="#ef233c" emissiveIntensity={0.9} toneMapped={false} />
      </RoundedBox>
      <RoundedBox args={[0.78, 0.78, 0.62]} radius={0.22} smoothness={5} position={[0, -0.63, -0.02]}>
        <meshStandardMaterial color="#f3f4f6" roughness={0.86} metalness={0.04} />
      </RoundedBox>
      <RoundedBox args={[0.22, 0.56, 0.25]} radius={0.1} smoothness={4} position={[-0.49, -0.58, 0]} rotation={[0, 0, -0.08]}>
        <meshStandardMaterial color="#e5e7eb" roughness={0.88} />
      </RoundedBox>
      <RoundedBox args={[0.22, 0.56, 0.25]} radius={0.1} smoothness={4} position={[0.49, -0.58, 0]} rotation={[0, 0, 0.08]}>
        <meshStandardMaterial color="#e5e7eb" roughness={0.88} />
      </RoundedBox>
      <RoundedBox args={[0.3, 0.42, 0.34]} radius={0.12} smoothness={4} position={[-0.22, -1.15, 0.02]}>
        <meshStandardMaterial color="#dfe3e8" roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[0.3, 0.42, 0.34]} radius={0.12} smoothness={4} position={[0.22, -1.15, 0.02]}>
        <meshStandardMaterial color="#dfe3e8" roughness={0.9} />
      </RoundedBox>
    </group>
  );
}

export function RobotAvatar({ onActivate }: RobotAvatarProps) {
  return (
    <button className="robot-widget" type="button" onClick={onActivate} aria-label="Open Rehan's AI assistant">
      <Canvas camera={{ position: [0, 0.05, 4.3], fov: 34 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={1.35} />
        <directionalLight position={[2.5, 3.2, 4]} intensity={2.5} color="#ffffff" />
        <pointLight position={[-2, 1.5, 2]} intensity={5} color="#ef233c" distance={5} />
        <RobotModel />
        <ContactShadows position={[0, -1.43, 0]} opacity={0.32} scale={3.2} blur={2.6} far={3} />
      </Canvas>
    </button>
  );
}
