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
  const [hovered, setHovered] = useState(false);
  const pointer = useThree((state) => state.pointer);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "";
    return () => { document.body.style.cursor = ""; };
  }, [hovered]);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const smoothing = 1 - Math.exp(-delta * 7);
    group.position.y = THREE.MathUtils.lerp(group.position.y, Math.sin(clock.elapsedTime * 1.65) * .09, smoothing);
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, hovered ? pointer.x * .28 : 0, smoothing);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, hovered ? -pointer.y * .16 : 0, smoothing);
  });

  return <group ref={groupRef} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)} scale={.88}>
    <RoundedBox args={[1.46, 1.18, .94]} radius={.26} smoothness={5} position={[0, .43, 0]} castShadow>
      <meshStandardMaterial color="#f3f4f6" roughness={.78} metalness={.06} />
    </RoundedBox>
    <RoundedBox args={[1.16, .76, .08]} radius={.17} smoothness={5} position={[0, .45, .495]}>
      <meshStandardMaterial color="#030303" roughness={.2} metalness={.34} />
    </RoundedBox>
    <RoundedBox args={[.2, .2, .055]} radius={.025} smoothness={3} position={[-.27, .47, .55]}>
      <meshStandardMaterial color="#ef233c" emissive="#ef233c" emissiveIntensity={.9} toneMapped={false} />
    </RoundedBox>
    <RoundedBox args={[.2, .2, .055]} radius={.025} smoothness={3} position={[.27, .47, .55]}>
      <meshStandardMaterial color="#ef233c" emissive="#ef233c" emissiveIntensity={.9} toneMapped={false} />
    </RoundedBox>

    <RoundedBox args={[.78, .78, .62]} radius={.22} smoothness={5} position={[0, -.63, -.02]} castShadow>
      <meshStandardMaterial color="#f3f4f6" roughness={.86} metalness={.04} />
    </RoundedBox>
    <RoundedBox args={[.22, .56, .25]} radius={.1} smoothness={4} position={[-.49, -.58, 0]} rotation={[0, 0, -.08]} castShadow>
      <meshStandardMaterial color="#e5e7eb" roughness={.88} />
    </RoundedBox>
    <RoundedBox args={[.22, .56, .25]} radius={.1} smoothness={4} position={[.49, -.58, 0]} rotation={[0, 0, .08]} castShadow>
      <meshStandardMaterial color="#e5e7eb" roughness={.88} />
    </RoundedBox>
    <RoundedBox args={[.3, .42, .34]} radius={.12} smoothness={4} position={[-.22, -1.15, .02]} castShadow>
      <meshStandardMaterial color="#dfe3e8" roughness={.9} />
    </RoundedBox>
    <RoundedBox args={[.3, .42, .34]} radius={.12} smoothness={4} position={[.22, -1.15, .02]} castShadow>
      <meshStandardMaterial color="#dfe3e8" roughness={.9} />
    </RoundedBox>
  </group>;
}

export function RobotAvatar({ onActivate }: RobotAvatarProps) {
  return <button className="robot-widget" type="button" onClick={onActivate} aria-label="Open Rehan's AI assistant">
    <Canvas camera={{ position: [0, .05, 4.3], fov: 34 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} shadows>
      <ambientLight intensity={1.35} />
      <directionalLight position={[2.5, 3.2, 4]} intensity={2.5} color="#ffffff" castShadow />
      <pointLight position={[-2, 1.5, 2]} intensity={5} color="#ef233c" distance={5} />
      <RobotModel />
      <ContactShadows position={[0, -1.43, 0]} opacity={.32} scale={3.2} blur={2.6} far={3} />
    </Canvas>
  </button>;
}
