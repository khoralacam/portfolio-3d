// src/components/games/cyber-track/canvas/CyberTrackCanvas.tsx
"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCyberTrackStore } from '../store/useCyberTrackStore';
import { PlayerVehicle } from './PlayerVehicle';
import { WorldTrack } from './WorldTrack';

function CameraRig({ playerXRef }: { playerXRef: React.MutableRefObject<number> }) {
  useFrame((state, dt) => {
    const store = useCyberTrackStore.getState();
    const cam = state.camera as THREE.PerspectiveCamera;

    // Smooth camera follow on X and slight elevation
    const targetCamX = playerXRef.current * 0.45;
    const targetCamY = store.gameState === 'MENU' ? 2.2 : 3.35;
    const targetCamZ = store.isNitroActive ? 6.2 : 7.2;

    cam.position.x = THREE.MathUtils.lerp(cam.position.x, targetCamX, dt * 6);
    cam.position.y = THREE.MathUtils.lerp(cam.position.y, targetCamY, dt * 5);
    cam.position.z = THREE.MathUtils.lerp(cam.position.z, targetCamZ, dt * 5);

    // Dynamic FOV boost when Nitro is active
    const targetFov = store.isNitroActive ? 74 : 60;
    if (Math.abs(cam.fov - targetFov) > 0.1) {
      cam.fov = THREE.MathUtils.lerp(cam.fov, targetFov, dt * 6);
      cam.updateProjectionMatrix();
    }

    cam.lookAt(playerXRef.current * 0.25, 0.9, -18);
  });

  return null;
}

export function CyberTrackCanvas() {
  const playerXRef = useRef<number>(0);
  const quality = useCyberTrackStore((s) => s.quality);
  const dpr: [number, number] =
    quality === 'HIGH' ? [1, 2] : quality === 'MEDIUM' ? [1, 1.5] : [0.8, 1];

  return (
    <div className="w-full h-full bg-[#050608] relative overflow-hidden">
      <Canvas
        shadows={quality === 'HIGH'}
        dpr={dpr}
        camera={{ position: [0, 3.35, 7.2], fov: 60, near: 0.1, far: 260 }}
        gl={{ antialias: quality !== 'LOW', powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#050608']} />
        <fog attach="fog" args={['#050608', 35, 210]} />

        {/* Atmospheric Cyberpunk Lighting */}
        <ambientLight intensity={0.65} color="#9299A6" />
        <directionalLight position={[15, 30, 15]} intensity={1.4} color="#FFD400" />
        <pointLight position={[0, 8, -25]} intensity={2.5} color="#FF303F" distance={60} />

        <CameraRig playerXRef={playerXRef} />
        <PlayerVehicle playerXRef={playerXRef} />
        <WorldTrack playerXRef={playerXRef} />
      </Canvas>
    </div>
  );
}