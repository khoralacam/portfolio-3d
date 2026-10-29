// src/components/games/cyber-track/store/useCyberTrackStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  GameState,
  GameMode,
  QualityPreset,
  LaneIndex,
  MISSIONS_LIST,
  VEHICLE_SKINS,
} from '../types/cyberTrack';
import { soundEngine } from '../audio/soundEngine';

interface CyberTrackState {
  // Game Flow
  gameState: GameState;
  gameMode: GameMode;
  quality: QualityPreset;

  // Live Telemetry
  score: number;
  distance: number;
  speed: number;
  maxSpeed: number;
  runCoins: number;
  survivalTime: number;
  timeTrialRemaining: number;
  obstaclesAvoided: number;
  health: number;
  damageFlash: number;

  // Player Lane & Nitro
  targetLane: LaneIndex;
  nitroCharge: number; // 0 to 100
  isNitroActive: boolean;
  nitroUsesThisRun: number;
  isBraking: boolean;

  // Active Power-ups
  hasShield: boolean;
  magnetTimeLeft: number;
  multiplierTimeLeft: number;

  // Persistent Data
  bestScore: number;
  walletCoins: number;
  selectedSkinId: string;
  unlockedSkins: string[];
  activeMissionId: string;
  completedMissions: string[];

  // Audio Settings
  masterVolume: number;
  sfxEnabled: boolean;

  // Actions
  setGameState: (state: GameState) => void;
  setGameMode: (mode: GameMode) => void;
  setQuality: (q: QualityPreset) => void;
  startGame: (mode?: GameMode) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  moveLane: (dir: -1 | 1) => void;
  setBraking: (braking: boolean) => void;
  activateNitro: () => void;
  collectCoin: () => void;
  activatePowerUp: (type: 'NITRO' | 'SHIELD' | 'MAGNET' | 'MULTIPLIER') => void;
  registerCollision: () => void;
  tickTelemetry: (dt: number) => void;
  buyOrSelectSkin: (skinId: string) => void;
  selectMission: (missionId: string) => void;
  updateAudioSettings: (volume: number, sfx: boolean) => void;
}

export const useCyberTrackStore = create<CyberTrackState>()(
  persist(
    (set, get) => ({
      gameState: 'MENU',
      gameMode: 'ENDLESS',
      quality: 'HIGH',

      score: 0,
      distance: 0,
      speed: 42,
      maxSpeed: 125,
      runCoins: 0,
      survivalTime: 0,
      timeTrialRemaining: 60,
      obstaclesAvoided: 0,
      health: 3,
      damageFlash: 0,

      targetLane: 0,
      nitroCharge: 100,
      isNitroActive: false,
      nitroUsesThisRun: 0,
      isBraking: false,

      hasShield: false,
      magnetTimeLeft: 0,
      multiplierTimeLeft: 0,

      bestScore: 0,
      walletCoins: 120,
      selectedSkinId: 'nexus-interceptor',
      unlockedSkins: ['nexus-interceptor'],
      activeMissionId: MISSIONS_LIST[0].id,
      completedMissions: [],

      masterVolume: 0.75,
      sfxEnabled: true,

      setGameState: (gameState) => {
        soundEngine.playClick();
        set({ gameState });
      },

      setGameMode: (gameMode) => {
        soundEngine.playClick();
        set({ gameMode });
      },

      setQuality: (quality) => {
        soundEngine.playClick();
        set({ quality });
      },

      startGame: (mode) => {
        const chosenMode = mode || get().gameMode;
        const skin = VEHICLE_SKINS.find((s) => s.id === get().selectedSkinId) || VEHICLE_SKINS[0];
        soundEngine.playClick();
        soundEngine.startEngine();

        set({
          gameState: 'PLAYING',
          gameMode: chosenMode,
          score: 0,
          distance: 0,
          speed: 45 * skin.speedBonus,
          maxSpeed: 130 * skin.speedBonus,
          runCoins: 0,
          survivalTime: 0,
          timeTrialRemaining: 60,
          obstaclesAvoided: 0,
          health: 3,
          damageFlash: 0,
          targetLane: 0,
          nitroCharge: 100,
          isNitroActive: false,
          nitroUsesThisRun: 0,
          isBraking: false,
          hasShield: false,
          magnetTimeLeft: 0,
          multiplierTimeLeft: 0,
        });
      },

      pauseGame: () => {
        if (get().gameState === 'PLAYING') {
          soundEngine.stopEngine();
          set({ gameState: 'PAUSED' });
        }
      },

      resumeGame: () => {
        if (get().gameState === 'PAUSED') {
          soundEngine.startEngine();
          set({ gameState: 'PLAYING' });
        }
      },

      endGame: () => {
        const { score, bestScore, walletCoins, runCoins } = get();
        soundEngine.stopEngine();
        set({
          gameState: 'GAMEOVER',
          bestScore: Math.max(score, bestScore),
          walletCoins: walletCoins + runCoins,
          isNitroActive: false,
        });
      },

      moveLane: (dir) => {
        const { gameState, targetLane } = get();
        if (gameState !== 'PLAYING') return;
        const next = Math.max(-1, Math.min(1, targetLane + dir)) as LaneIndex;
        if (next !== targetLane) {
          set({ targetLane: next });
        }
      },

      setBraking: (isBraking) => set({ isBraking }),

      activateNitro: () => {
        const { gameState, nitroCharge, isNitroActive, nitroUsesThisRun } = get();
        if (gameState !== 'PLAYING' || isNitroActive || nitroCharge < 25) return;
        soundEngine.playNitro();
        set({
          isNitroActive: true,
          nitroUsesThisRun: nitroUsesThisRun + 1,
        });
      },

      collectCoin: () => {
        const { runCoins, score, multiplierTimeLeft } = get();
        soundEngine.playCoin();
        const mult = multiplierTimeLeft > 0 ? 2 : 1;
        set({
          runCoins: runCoins + 1,
          score: score + 50 * mult,
          nitroCharge: Math.min(100, get().nitroCharge + 4),
        });
      },

      activatePowerUp: (type) => {
        soundEngine.playPowerUp();
        if (type === 'SHIELD') set({ hasShield: true });
        if (type === 'MAGNET') set({ magnetTimeLeft: 10 });
        if (type === 'MULTIPLIER') set({ multiplierTimeLeft: 10 });
        if (type === 'NITRO') {
          set({ nitroCharge: 100, isNitroActive: true });
          soundEngine.playNitro();
        }
      },

      registerCollision: () => {
        const { hasShield, health } = get();
        soundEngine.playCollision();

        if (hasShield) {
          set({ hasShield: false, damageFlash: 0.6 });
          return;
        }

        const nextHealth = health - 1;
        if (nextHealth <= 0) {
          set({ health: 0, damageFlash: 1 });
          get().endGame();
        } else {
          set({
            health: nextHealth,
            damageFlash: 1,
            speed: Math.max(38, get().speed * 0.72),
            isNitroActive: false,
          });
        }
      },

      tickTelemetry: (dt) => {
        const s = get();
        if (s.gameState !== 'PLAYING') return;

        // Progressive speed scaling
        const targetMax = s.maxSpeed;
        let currentSpeed = s.speed;
        if (s.isNitroActive) {
          currentSpeed = Math.min(targetMax * 1.45, currentSpeed + 65 * dt);
        } else if (s.isBraking) {
          currentSpeed = Math.max(32, currentSpeed - 45 * dt);
        } else {
          currentSpeed = Math.min(targetMax, currentSpeed + 3.2 * dt);
        }

        // Nitro drain/recharge
        let nextNitro = s.nitroCharge;
        let nitroActive = s.isNitroActive;
        if (nitroActive) {
          nextNitro -= 28 * dt;
          if (nextNitro <= 0) {
            nextNitro = 0;
            nitroActive = false;
          }
        } else {
          nextNitro = Math.min(100, nextNitro + 5.5 * dt);
        }

        const distDelta = (currentSpeed * dt) * 0.45;
        const nextDistance = s.distance + distDelta;
        const mult = s.multiplierTimeLeft > 0 ? 2 : 1;
        const nextScore = s.score + Math.round(distDelta * 2.2 * mult);
        const nextSurvival = s.survivalTime + dt;

        soundEngine.updateEnginePitch(currentSpeed / targetMax, nitroActive);

        // Time Trial check
        if (s.gameMode === 'TIME_TRIAL') {
          const rem = s.timeTrialRemaining - dt;
          if (rem <= 0) {
            set({ timeTrialRemaining: 0 });
            get().endGame();
            return;
          }
          set({ timeTrialRemaining: rem });
        }

        // Mission completion check
        const mission = MISSIONS_LIST.find((m) => m.id === s.activeMissionId);
        if (mission && !s.completedMissions.includes(mission.id)) {
          let achieved = false;
          if (mission.type === 'COINS' && s.runCoins >= mission.target) achieved = true;
          if (mission.type === 'DISTANCE' && nextDistance >= mission.target) achieved = true;
          if (mission.type === 'SURVIVAL' && nextSurvival >= mission.target) achieved = true;
          if (mission.type === 'NITRO_USES' && s.nitroUsesThisRun >= mission.target) achieved = true;

          if (achieved) {
            soundEngine.playPowerUp();
            set({
              completedMissions: [...s.completedMissions, mission.id],
              walletCoins: s.walletCoins + mission.reward,
              score: nextScore + 1000,
            });
          }
        }

        set({
          speed: currentSpeed,
          distance: nextDistance,
          score: nextScore,
          survivalTime: nextSurvival,
          nitroCharge: nextNitro,
          isNitroActive: nitroActive,
          magnetTimeLeft: Math.max(0, s.magnetTimeLeft - dt),
          multiplierTimeLeft: Math.max(0, s.multiplierTimeLeft - dt),
          damageFlash: Math.max(0, s.damageFlash - dt * 2.5),
        });
      },

      buyOrSelectSkin: (skinId) => {
        const { unlockedSkins, walletCoins } = get();
        const skin = VEHICLE_SKINS.find((s) => s.id === skinId);
        if (!skin) return;

        soundEngine.playClick();
        if (unlockedSkins.includes(skinId)) {
          set({ selectedSkinId: skinId });
        } else if (walletCoins >= skin.price) {
          soundEngine.playPowerUp();
          set({
            walletCoins: walletCoins - skin.price,
            unlockedSkins: [...unlockedSkins, skinId],
            selectedSkinId: skinId,
          });
        }
      },

      selectMission: (missionId) => {
        soundEngine.playClick();
        set({ activeMissionId: missionId });
      },

      updateAudioSettings: (masterVolume, sfxEnabled) => {
        soundEngine.setSettings(masterVolume, sfxEnabled);
        set({ masterVolume, sfxEnabled });
      },
    }),
    {
      name: 'cyber-track-storage-v1',
      partialize: (state) => ({
        bestScore: state.bestScore,
        walletCoins: state.walletCoins,
        selectedSkinId: state.selectedSkinId,
        unlockedSkins: state.unlockedSkins,
        completedMissions: state.completedMissions,
        quality: state.quality,
        masterVolume: state.masterVolume,
        sfxEnabled: state.sfxEnabled,
      }),
    }
  )
);