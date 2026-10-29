// src/components/games/cyber-track/canvas/WorldTrack.tsx
"use client";

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCyberTrackStore } from '../store/useCyberTrackStore';
import {
  LANE_POSITIONS,
  LANE_WIDTH,
  LaneIndex,
  ObstacleEntity,
  CollectibleEntity,
} from '../types/cyberTrack';

interface WorldTrackProps {
  playerXRef: React.MutableRefObject<number>;
}

const ROAD_SEGMENT_LENGTH = 20;
const ROAD_SEGMENT_COUNT = 14;
const OBSTACLE_POOL_SIZE = 10;
const COLLECTIBLE_POOL_SIZE = 18;

const LANES: LaneIndex[] = [-1, 0, 1];

export function WorldTrack({ playerXRef }: WorldTrackProps) {
  const quality = useCyberTrackStore((s) => s.quality);
  const buildingCount = quality === 'HIGH' ? 70 : quality === 'MEDIUM' ? 44 : 26;

  // Refs for road marker animation
  const roadGroupRef = useRef<THREE.Group>(null);
  const obstacleRefs = useRef<(THREE.Group | null)[]>([]);
  const collectibleRefs = useRef<(THREE.Group | null)[]>([]);
  const skyCarsRef = useRef<THREE.Group>(null);

  // Pooled Obstacles State (No React re-renders in game loop)
  const obstaclesPool = useMemo<ObstacleEntity[]>(() => {
    return Array.from({ length: OBSTACLE_POOL_SIZE }, (_, i) => ({
      id: i,
      lane: LANES[i % 3],
      z: -35 - i * 26,
      type: i % 4 === 0 ? 'LASER_GATE' : i % 2 === 0 ? 'TRAFFIC_CAR' : 'NEON_BARRIER',
      speed: i % 2 === 0 ? 18 : 0,
      active: true,
      movingDirection: i % 2 === 0 ? 1 : -1,
    }));
  }, []);

  // Pooled Coins & PowerUps State
  const collectiblesPool = useMemo<CollectibleEntity[]>(() => {
    return Array.from({ length: COLLECTIBLE_POOL_SIZE }, (_, i) => ({
      id: i,
      lane: LANES[i % 3],
      z: -22 - i * 14,
      kind:
        i === 7
          ? 'SHIELD'
          : i === 13
          ? 'MAGNET'
          : i === 17
          ? 'MULTIPLIER'
          : 'COIN',
      active: true,
    }));
  }, []);

  // Procedural Skyscraper Layouts
  const buildings = useMemo(() => {
    return Array.from({ length: buildingCount }, (_, i) => {
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (11 + (i % 5) * 4.5);
      const z = -((i * 12) % 240) + 20;
      const height = 14 + ((i * 7) % 34);
      const width = 3.2 + (i % 3) * 1.4;
      const depth = 3.2 + ((i + 1) % 3) * 1.4;
      const isRedAccent = i % 4 === 0;
      return { id: i, x, z, height, width, depth, isRedAccent };
    });
  }, [buildingCount]);

  // Main Frame Loop: Road scrolling, Obstacle spawning, Coin magnet & Collision Detection
  useFrame((state, dt) => {
    const store = useCyberTrackStore.getState();
    if (store.gameState !== 'PLAYING') return;

    const clampedDt = Math.min(dt, 0.05);
    store.tickTelemetry(clampedDt);

    const worldMoveZ = store.speed * clampedDt;
    const playerX = playerXRef.current;

    // 1. Scroll Road Segments seamlessly
    if (roadGroupRef.current) {
      roadGroupRef.current.position.z += worldMoveZ;
      if (roadGroupRef.current.position.z >= ROAD_SEGMENT_LENGTH) {
        roadGroupRef.current.position.z -= ROAD_SEGMENT_LENGTH;
      }
    }

    // 2. Animate Distant Flying Sky Cars
    if (skyCarsRef.current) {
      skyCarsRef.current.children.forEach((child, idx) => {
        child.position.x += (idx % 2 === 0 ? 18 : -18) * clampedDt;
        if (child.position.x > 65) child.position.x = -65;
        if (child.position.x < -65) child.position.x = 65;
      });
    }

    // 3. Update Obstacles & Check Collisions
    obstaclesPool.forEach((obs, idx) => {
      obs.z += (store.speed - obs.speed) * clampedDt;

      //Recycle obstacle ahead of horizon when passed
      if (obs.z > 14) {
        obs.z = -230 - Math.random() * 45;
        obs.lane = LANES[Math.floor(Math.random() * 3)];
        obs.active = true;
        const r = Math.random();
        obs.type = r > 0.72 ? 'LASER_GATE' : r > 0.35 ? 'TRAFFIC_CAR' : 'NEON_BARRIER';
        obs.speed = obs.type === 'TRAFFIC_CAR' ? 16 + Math.random() * 14 : 0;
      }

      const meshGroup = obstacleRefs.current[idx];
      if (meshGroup) {
        const obsX = LANE_POSITIONS[obs.lane];
        meshGroup.position.set(obsX, 0, obs.z);
        meshGroup.visible = obs.active;

        // Bounding Box Collision Check with Player (z near 0)
        if (obs.active && Math.abs(obs.z) < 2.15 && Math.abs(playerX - obsX) < 1.35) {
          obs.active = false;
          meshGroup.visible = false;
          store.registerCollision();
        }
      }
    });

    // 4. Update Coins & Power-Ups + Magnet Attraction
    collectiblesPool.forEach((item, idx) => {
      item.z += worldMoveZ;

      if (item.z > 12) {
        item.z = -210 - Math.random() * 35;
        item.lane = LANES[Math.floor(Math.random() * 3)];
        item.active = true;
        const rand = Math.random();
        item.kind =
          rand > 0.94
            ? 'SHIELD'
            : rand > 0.89
            ? 'MAGNET'
            : rand > 0.84
            ? 'MULTIPLIER'
            : rand > 0.79
            ? 'NITRO'
            : 'COIN';
      }

      const meshGroup = collectibleRefs.current[idx];
      if (meshGroup) {
        let itemX = LANE_POSITIONS[item.lane];

        // Magnet pulls coins toward player
        if (store.magnetTimeLeft > 0 && item.kind === 'COIN' && item.z > -32 && item.z < 4) {
          itemX = THREE.MathUtils.lerp(meshGroup.position.x, playerX, clampedDt * 9);
        }

        meshGroup.position.set(itemX, 0.85, item.z);
        meshGroup.rotation.y += clampedDt * 3.5;
        meshGroup.visible = item.active;

        // Pickup detection
        if (item.active && Math.abs(item.z) < 2.1 && Math.abs(playerX - itemX) < 1.55) {
          item.active = false;
          meshGroup.visible = false;
          if (item.kind === 'COIN') {
            store.collectCoin();
          } else {
            store.activatePowerUp(item.kind);
          }
        }
      }
    });
  });

  return (
    <group>
      {/* --- ENDLESS RECYCLED ROAD SEGMENTS --- */}
      <group ref={roadGroupRef}>
        {Array.from({ length: ROAD_SEGMENT_COUNT }).map((_, i) => {
          const segZ = -i * ROAD_SEGMENT_LENGTH;
          return (
            <group key={i} position={[0, 0, segZ]}>
              {/* Dark Reflective Asphalt Surface */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[12.5, ROAD_SEGMENT_LENGTH]} />
                <meshStandardMaterial color="#07090e" metalness={0.75} roughness={0.25} />
              </mesh>

              {/* Animated Neon Yellow Lane Dividers */}
              {[-LANE_WIDTH / 2, LANE_WIDTH / 2].map((lx, lIdx) => (
                <mesh key={lIdx} position={[lx, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[0.14, ROAD_SEGMENT_LENGTH * 0.55]} />
                  <meshStandardMaterial
                    color="#FFD400"
                    emissive="#FFD400"
                    emissiveIntensity={2.2}
                  />
                </mesh>
              ))}

              {/* Left & Right Glowing Side Barriers */}
              {[-6.2, 6.2].map((bx, bIdx) => (
                <group key={bIdx} position={[bx, 0.35, 0]}>
                  <mesh>
                    <boxGeometry args={[0.35, 0.7, ROAD_SEGMENT_LENGTH]} />
                    <meshStandardMaterial color="#141820" metalness={0.8} roughness={0.3} />
                  </mesh>
                  <mesh position={[bx < 0 ? 0.19 : -0.19, 0.15, 0]}>
                    <boxGeometry args={[0.05, 0.12, ROAD_SEGMENT_LENGTH * 0.85]} />
                    <meshStandardMaterial
                      color={i % 2 === 0 ? '#FFD400' : '#FF303F'}
                      emissive={i % 2 === 0 ? '#FFD400' : '#FF303F'}
                      emissiveIntensity={2.5}
                    />
                  </mesh>
                </group>
              ))}
            </group>
          );
        })}
      </group>

      {/* --- POOLED OBSTACLES (TRAFFIC, BARRIERS, LASER GATES) --- */}
      {obstaclesPool.map((obs, idx) => (
        <group
          key={obs.id}
          ref={(el) => {
            obstacleRefs.current[idx] = el;
          }}
          position={[LANE_POSITIONS[obs.lane], 0, obs.z]}
        >
          {obs.type === 'TRAFFIC_CAR' && (
            <group position={[0, 0.45, 0]}>
              <mesh>
                <boxGeometry args={[1.65, 0.65, 3.4]} />
                <meshStandardMaterial color="#141820" metalness={0.8} roughness={0.25} />
              </mesh>
              {/* Red Rear Warning Lights */}
              <mesh position={[0, 0.1, 1.72]}>
                <boxGeometry args={[1.4, 0.18, 0.06]} />
                <meshStandardMaterial color="#FF303F" emissive="#FF303F" emissiveIntensity={3.5} />
              </mesh>
            </group>
          )}

          {obs.type === 'NEON_BARRIER' && (
            <group position={[0, 0.65, 0]}>
              <mesh>
                <boxGeometry args={[2.5, 1.25, 0.55]} />
                <meshStandardMaterial color="#0B0D12" metalness={0.7} roughness={0.3} />
              </mesh>
              <mesh position={[0, 0.15, 0.3]}>
                <boxGeometry args={[2.3, 0.25, 0.05]} />
                <meshStandardMaterial color="#FF303F" emissive="#FF303F" emissiveIntensity={4} />
              </mesh>
            </group>
          )}

          {obs.type === 'LASER_GATE' && (
            <group position={[0, 1.1, 0]}>
              <mesh position={[-1.2, 0, 0]}>
                <boxGeometry args={[0.25, 2.2, 0.25]} />
                <meshStandardMaterial color="#141820" />
              </mesh>
              <mesh position={[1.2, 0, 0]}>
                <boxGeometry args={[0.25, 2.2, 0.25]} />
                <meshStandardMaterial color="#141820" />
              </mesh>
              <mesh position={[0, -0.2, 0]}>
                <boxGeometry args={[2.3, 0.18, 0.1]} />
                <meshStandardMaterial color="#FF303F" emissive="#FF303F" emissiveIntensity={5} />
              </mesh>
              <mesh position={[0, 0.4, 0]}>
                <boxGeometry args={[2.3, 0.18, 0.1]} />
                <meshStandardMaterial color="#FF303F" emissive="#FF303F" emissiveIntensity={5} />
              </mesh>
            </group>
          )}
        </group>
      ))}

      {/* --- POOLED RED ENERGY COINS & POWER-UPS --- */}
      {collectiblesPool.map((item, idx) => {
        const isCoin = item.kind === 'COIN';
        const color = isCoin
          ? '#FF303F'
          : item.kind === 'SHIELD'
          ? '#00F0FF'
          : item.kind === 'MAGNET'
          ? '#A855F7'
          : '#FFD400';

        return (
          <group
            key={item.id}
            ref={(el) => {
              collectibleRefs.current[idx] = el;
            }}
            position={[LANE_POSITIONS[item.lane], 0.85, item.z]}
          >
            {/* Outer Glowing Ring */}
            <mesh>
              <torusGeometry args={[0.52, 0.12, 12, 24]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3.4} />
            </mesh>
            {/* Metallic Core */}
            <mesh>
              <cylinderGeometry args={[0.28, 0.28, 0.12, 16]} />
              <meshStandardMaterial color="#FFD400" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        );
      })}

      {/* --- PROCEDURAL CYBERPUNK CITY SKYSCRAPERS --- */}
      {buildings.map((b) => (
        <group key={b.id} position={[b.x, b.height / 2 - 1, b.z]}>
          <mesh>
            <boxGeometry args={[b.width, b.height, b.depth]} />
            <meshStandardMaterial color="#090b10" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Neon Vertical Window Strips */}
          <mesh position={[b.x < 0 ? b.width / 2 + 0.02 : -b.width / 2 - 0.02, 0, 0]}>
            <planeGeometry args={[0.22, b.height * 0.82]} />
            <meshStandardMaterial
              color={b.isRedAccent ? '#FF303F' : '#FFD400'}
              emissive={b.isRedAccent ? '#FF303F' : '#FFD400'}
              emissiveIntensity={2.2}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}

      {/* --- DISTANT FLYING SKY CARS --- */}
      <group ref={skyCarsRef}>
        {Array.from({ length: 8 }).map((_, idx) => (
          <mesh
            key={idx}
            position={[(idx - 4) * 16, 12 + (idx % 3) * 5, -90 - idx * 15]}
          >
            <boxGeometry args={[2.2, 0.3, 0.6]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#FFD400' : '#FF303F'}
              emissive={idx % 2 === 0 ? '#FFD400' : '#FF303F'}
              emissiveIntensity={3}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}