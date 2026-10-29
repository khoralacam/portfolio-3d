// src/components/games/cyber-track/types/cyberTrack.ts

export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAMEOVER' | 'GARAGE' | 'MISSIONS' | 'SETTINGS';
export type GameMode = 'ENDLESS' | 'TIME_TRIAL' | 'MISSION';
export type QualityPreset = 'LOW' | 'MEDIUM' | 'HIGH';
export type LaneIndex = -1 | 0 | 1; // Left (-3.2), Center (0), Right (+3.2)

export type PowerUpType = 'NITRO' | 'SHIELD' | 'MAGNET' | 'MULTIPLIER';
export type ObstacleType = 'TRAFFIC_CAR' | 'NEON_BARRIER' | 'LASER_GATE';

export interface VehicleSkin {
  id: string;
  name: string;
  tagline: string;
  price: number;
  bodyColor: string;
  accentColor: string;
  emissiveColor: string;
  speedBonus: number;
  nitroBonus: number;
}

export interface MissionConfig {
  id: string;
  title: string;
  description: string;
  type: 'COINS' | 'DISTANCE' | 'SURVIVAL' | 'NITRO_USES';
  target: number;
  reward: number;
}

export interface ObstacleEntity {
  id: number;
  lane: LaneIndex;
  z: number;
  type: ObstacleType;
  speed: number;
  active: boolean;
  movingDirection?: number;
}

export interface CollectibleEntity {
  id: number;
  lane: LaneIndex;
  z: number;
  kind: 'COIN' | PowerUpType;
  active: boolean;
}

export const LANE_WIDTH = 3.4;
export const LANE_POSITIONS: Record<LaneIndex, number> = {
  [-1]: -LANE_WIDTH,
  [0]: 0,
  [1]: LANE_WIDTH,
};

export const VEHICLE_SKINS: VehicleSkin[] = [
  {
    id: 'nexus-interceptor',
    name: 'NEXUS V8 INTERCEPTOR',
    tagline: 'STANDARD BLACK & YELLOW SPEC',
    price: 0,
    bodyColor: '#0B0D12',
    accentColor: '#FFD400',
    emissiveColor: '#FFD400',
    speedBonus: 1.0,
    nitroBonus: 1.0,
  },
  {
    id: 'crimson-wraith',
    name: 'CRIMSON WRAITH GT',
    tagline: 'HIGH-OUTPUT RED PHOTON CORE',
    price: 100,
    bodyColor: '#09090d',
    accentColor: '#FF303F',
    emissiveColor: '#FF303F',
    speedBonus: 1.08,
    nitroBonus: 1.15,
  },
  {
    id: 'aurum-phantom',
    name: 'AURUM PHANTOM X',
    tagline: 'PURE GOLD OVERCLOCKED CHASSIS',
    price: 250,
    bodyColor: '#141820',
    accentColor: '#FFEA70',
    emissiveColor: '#FFD400',
    speedBonus: 1.15,
    nitroBonus: 1.25,
  },
];

export const MISSIONS_LIST: MissionConfig[] = [
  {
    id: 'mission-coins-30',
    title: 'ENERGY HARVESTER',
    description: 'Collect 30 Red Energy Coins in a single run.',
    type: 'COINS',
    target: 30,
    reward: 75,
  },
  {
    id: 'mission-survive-90',
    title: 'NIGHTRUNNER ENDURANCE',
    description: 'Survive for 90 seconds at high velocity.',
    type: 'SURVIVAL',
    target: 90,
    reward: 120,
  },
  {
    id: 'mission-distance-1500',
    title: 'SECTOR OVERDRIVE',
    description: 'Reach 1,500m without system failure.',
    type: 'DISTANCE',
    target: 1500,
    reward: 150,
  },
  {
    id: 'mission-nitro-4',
    title: 'PLASMA INJECTION',
    description: 'Activate Nitro Boost 4 times in one session.',
    type: 'NITRO_USES',
    target: 4,
    reward: 90,
  },
];