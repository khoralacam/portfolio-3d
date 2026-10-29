// src/components/games/cyber-track/canvas/PlayerVehicle.tsx
"use client";

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCyberTrackStore } from '../store/useCyberTrackStore';
import { LANE_POSITIONS, VEHICLE_SKINS } from '../types/cyberTrack';

interface PlayerVehicleProps {
  playerXRef: React.MutableRefObject<number>;
}

export function PlayerVehicle({ playerXRef }: PlayerVehicleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const shieldRef = useRef<THREE.Mesh>(null);
  const thrusterRef = useRef<THREE.Mesh>(null);

  const selectedSkinId = useCyberTrackStore((s) => s.selectedSkinId);
  const hasShield = useCyberTrackStore((s) => s.hasShield);
  const isNitroActive = useCyberTrackStore((s) => s.isNitroActive);
  const damageFlash = useCyberTrackStore((s) => s.damageFlash);

  const skin = VEHICLE_SKINS.find((s) => s.id === selectedSkinId) || VEHICLE_SKINS[0];

  useFrame((state, dt) => {
    if (!groupRef.current) return;
    const store = useCyberTrackStore.getState();
    const targetX = LANE_POSITIONS[store.targetLane];

    // Smooth lane transition independent of React re-renders
    const currentX = groupRef.current.position.x;
    const nextX = THREE.MathUtils.lerp(currentX, targetX, Math.min(1, dt * 12));
    groupRef.current.position.x = nextX;
    playerXRef.current = nextX;

    // Banking tilt when changing lanes
    const velocityX = targetX - nextX;
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      -velocityX * 0.14,
      dt * 10
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      -velocityX * 0.06,
      dt * 10
    );

    // High-speed suspension bounce
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = 0.42 + Math.sin(t * 18) * 0.025;

    // Thruster scale pulse on Nitro
    if (thrusterRef.current) {
      const scaleZ = store.isNitroActive ? 2.6 + Math.sin(t * 40) * 0.5 : 1 + Math.sin(t * 20) * 0.15;
      thrusterRef.current.scale.set(1, 1, scaleZ);
    }

    // Rotate shield
    if (shieldRef.current && store.hasShield) {
      shieldRef.current.rotation.y += dt * 2.5;
    }
  });

  const chassisColor = damageFlash > 0.2 ? '#FF303F' : skin.bodyColor;

  return (
    <group ref={groupRef} position={[0, 0.42, 0]}>
      {/* Main Aerodynamic Lower Chassis */}
      <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
        <boxGeometry args={[1.75, 0.38, 3.8]} />
        <meshStandardMaterial color={chassisColor} metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Sleek Cockpit Canopy */}
      <mesh position={[0, 0.48, -0.15]}>
        <boxGeometry args={[1.25, 0.34, 1.95]} />
        <meshStandardMaterial color="#050608" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Neon Side Trim Strips */}
      <mesh position={[-0.9, 0.18, 0]}>
        <boxGeometry args={[0.06, 0.1, 3.6]} />
        <meshStandardMaterial
          color={skin.accentColor}
          emissive={skin.emissiveColor}
          emissiveIntensity={2.2}
        />
      </mesh>
      <mesh position={[0.9, 0.18, 0]}>
        <boxGeometry args={[0.06, 0.1, 3.6]} />
        <meshStandardMaterial
          color={skin.accentColor}
          emissive={skin.emissiveColor}
          emissiveIntensity={2.2}
        />
      </mesh>

      {/* Center Hood Neon Power Line */}
      <mesh position={[0, 0.35, -1.1]}>
        <boxGeometry args={[0.22, 0.04, 1.3]} />
        <meshStandardMaterial
          color={skin.accentColor}
          emissive={skin.emissiveColor}
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* Rear Aerodynamic Spoiler */}
      <mesh position={[0, 0.58, 1.65]}>
        <boxGeometry args={[1.7, 0.08, 0.38]} />
        <meshStandardMaterial color={skin.bodyColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Glowing Yellow Front Headlights */}
      <mesh position={[-0.55, 0.2, -1.91]}>
        <boxGeometry args={[0.42, 0.12, 0.05]} />
        <meshStandardMaterial color="#FFEA70" emissive="#FFD400" emissiveIntensity={3.5} />
      </mesh>
      <mesh position={[0.55, 0.2, -1.91]}>
        <boxGeometry args={[0.42, 0.12, 0.05]} />
        <meshStandardMaterial color="#FFEA70" emissive="#FFD400" emissiveIntensity={3.5} />
      </mesh>

      {/* Glowing Red Rear Tail Light Bar */}
      <mesh position={[0, 0.26, 1.91]}>
        <boxGeometry args={[1.55, 0.12, 0.05]} />
        <meshStandardMaterial color="#FF303F" emissive="#FF303F" emissiveIntensity={3.2} />
      </mesh>

      {/* Nitro Plasma Flame Cone */}
      <mesh ref={thrusterRef} position={[0, 0.12, 2.25]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.35, 0.9, 12]} />
        <meshStandardMaterial
          color={isNitroActive ? '#FFEA70' : '#FFD400'}
          emissive={isNitroActive ? '#FFD400' : '#FF303F'}
          emissiveIntensity={isNitroActive ? 4.5 : 2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* 4 Futuristic Glowing Rim Wheels */}
      {[
        [-0.92, 0.0, -1.15],
        [0.92, 0.0, -1.15],
        [-0.92, 0.0, 1.15],
        [0.92, 0.0, 1.15],
      ].map(([wx, wy, wz], idx) => (
        <group key={idx} position={[wx, wy, wz]} rotation={[0, 0, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[0.36, 0.36, 0.28, 16]} />
            <meshStandardMaterial color="#050608" roughness={0.4} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.22, 0.22, 0.3, 12]} />
            <meshStandardMaterial
              color={skin.accentColor}
              emissive={skin.emissiveColor}
              emissiveIntensity={1.8}
            />
          </mesh>
        </group>
      ))}

      {/* Energy Shield Forcefield */}
      {hasShield && (
        <mesh ref={shieldRef} position={[0, 0.25, 0]}>
          <sphereGeometry args={[2.35, 24, 24]} />
          <meshStandardMaterial
            color="#FFD400"
            emissive="#FFD400"
            emissiveIntensity={1.5}
            wireframe
            transparent
            opacity={0.42}
          />
        </mesh>
      )}
    </group>
  );
}