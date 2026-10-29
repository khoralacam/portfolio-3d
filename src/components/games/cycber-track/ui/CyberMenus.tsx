// src/components/games/cyber-track/ui/CyberMenus.tsx
"use client";

import React from 'react';
import {
  Play,
  RotateCcw,
  Car,
  Target,
  Settings,
  Trophy,
  Volume2,
  VolumeX,
  ArrowLeft,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useCyberTrackStore } from '../store/useCyberTrackStore';
import {
  VEHICLE_SKINS,
  MISSIONS_LIST,
  QualityPreset,
  GameMode,
} from '../types/cyberTrack';

export function CyberMenus() {
  const store = useCyberTrackStore();

  if (store.gameState === 'PLAYING') return null;

  return (
    <div className="absolute inset-0 z-30 bg-[#050608]/80 backdrop-blur-md flex items-center justify-center p-4 font-mono select-none overflow-y-auto">
      {/* --- MAIN MENU --- */}
      {store.gameState === 'MENU' && (
        <div className="max-w-xl w-full bg-[#0B0D12] border border-[#FFD400]/50 rounded-2xl p-6 md:p-8 shadow-[0_0_60px_rgba(255,212,0,0.12)] space-y-6">
          <div className="flex items-center justify-between text-xs text-[#9299A6] border-b border-neutral-800 pb-3">
            <span className="text-[#FFD400] font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FFD400] animate-ping" />
              CYBER TRACK // ENGINE v4.2
            </span>
            <div className="flex items-center gap-4">
              <span className="text-[#FF303F] font-bold">● {store.walletCoins} CORES</span>
              <span className="text-white font-bold flex items-center gap-1">
                <Trophy size={13} className="text-[#FFD400]" /> BEST: {store.bestScore.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-center py-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-wider text-white uppercase">
              CYBER <span className="text-[#FFD400] drop-shadow-[0_0_15px_rgba(255,212,0,0.5)]">TRACK</span>
            </h1>
            <p className="text-xs text-[#9299A6] max-w-md mx-auto">
              Drive the neon midnight sector. Dodge traffic, harvest red energy cores, and engage plasma nitro.
            </p>
          </div>

          {/* Mode Selector */}
          <div className="grid grid-cols-3 gap-2">
            {(['ENDLESS', 'TIME_TRIAL', 'MISSION'] as GameMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => store.setGameMode(mode)}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition cursor-pointer ${
                  store.gameMode === mode
                    ? 'bg-[#FFD400] text-black border-[#FFD400]'
                    : 'bg-[#141820] text-[#9299A6] border-neutral-800 hover:text-white'
                }`}
              >
                {mode.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Primary Launch Button */}
          <button
            onClick={() => store.startGame()}
            className="w-full py-4 bg-[#FFD400] hover:bg-[#FFEA70] text-black font-black text-base rounded-xl flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,212,0,0.4)] transition cursor-pointer"
          >
            <Play size={18} fill="black" /> START NEON RUN
          </button>

          {/* Sub-Menus: Garage, Missions, Settings */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            <button
              onClick={() => store.setGameState('GARAGE')}
              className="py-3 bg-[#141820] hover:border-[#FFD400] border border-neutral-800 rounded-xl text-xs font-bold text-white flex flex-col items-center gap-1.5 transition cursor-pointer"
            >
              <Car size={18} className="text-[#FFD400]" /> GARAGE
            </button>
            <button
              onClick={() => store.setGameState('MISSIONS')}
              className="py-3 bg-[#141820] hover:border-[#FFD400] border border-neutral-800 rounded-xl text-xs font-bold text-white flex flex-col items-center gap-1.5 transition cursor-pointer"
            >
              <Target size={18} className="text-[#FF303F]" /> MISSIONS
            </button>
            <button
              onClick={() => store.setGameState('SETTINGS')}
              className="py-3 bg-[#141820] hover:border-[#FFD400] border border-neutral-800 rounded-xl text-xs font-bold text-white flex flex-col items-center gap-1.5 transition cursor-pointer"
            >
              <Settings size={18} className="text-[#9299A6]" /> SETTINGS
            </button>
          </div>

          <div className="text-[11px] text-[#9299A6] text-center border-t border-neutral-800 pt-3">
            CONTROLS: [A/D or ARROWS] LANE STEER • [SPACE] NITRO • [S] BRAKE • [P] PAUSE
          </div>
        </div>
      )}

      {/* --- GARAGE MENU --- */}
      {store.gameState === 'GARAGE' && (
        <div className="max-w-xl w-full bg-[#0B0D12] border border-[#FFD400]/50 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <button
              onClick={() => store.setGameState('MENU')}
              className="text-xs text-[#9299A6] hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft size={15} /> BACK
            </button>
            <h2 className="text-lg font-black text-white">CYBER GARAGE</h2>
            <span className="text-xs text-[#FF303F] font-bold">● {store.walletCoins} CORES</span>
          </div>

          <div className="space-y-3">
            {VEHICLE_SKINS.map((skin) => {
              const isUnlocked = store.unlockedSkins.includes(skin.id);
              const isSelected = store.selectedSkinId === skin.id;

              return (
                <div
                  key={skin.id}
                  className={`p-4 rounded-xl border flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#141820] border-[#FFD400]'
                      : 'bg-[#141820]/60 border-neutral-800'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: skin.accentColor }}
                      />
                      <span className="text-sm font-bold text-white">{skin.name}</span>
                    </div>
                    <p className="text-[11px] text-[#9299A6]">{skin.tagline}</p>
                    <div className="text-[10px] text-[#FFD400]">
                      TOP SPEED: +{Math.round((skin.speedBonus - 1) * 100)}% | NITRO: +
                      {Math.round((skin.nitroBonus - 1) * 100)}%
                    </div>
                  </div>

                  <button
                    onClick={() => store.buyOrSelectSkin(skin.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : isUnlocked
                        ? 'bg-[#FFD400] text-black'
                        : store.walletCoins >= skin.price
                        ? 'bg-[#FF303F] text-white'
                        : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    }`}
                  >
                    {isSelected
                      ? 'EQUIPPED'
                      : isUnlocked
                      ? 'SELECT'
                      : `UNLOCK (${skin.price} ●)`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- MISSIONS MENU --- */}
      {store.gameState === 'MISSIONS' && (
        <div className="max-w-xl w-full bg-[#0B0D12] border border-[#FFD400]/50 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <button
              onClick={() => store.setGameState('MENU')}
              className="text-xs text-[#9299A6] hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft size={15} /> BACK
            </button>
            <h2 className="text-lg font-black text-white">SECTOR MISSIONS</h2>
            <span className="text-xs text-[#FFD400]">
              {store.completedMissions.length}/{MISSIONS_LIST.length} DONE
            </span>
          </div>

          <div className="space-y-3">
            {MISSIONS_LIST.map((m) => {
              const completed = store.completedMissions.includes(m.id);
              const active = store.activeMissionId === m.id;

              return (
                <div
                  key={m.id}
                  onClick={() => store.selectMission(m.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    active ? 'bg-[#141820] border-[#FFD400]' : 'bg-[#141820]/50 border-neutral-800'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      {completed ? (
                        <CheckCircle2 size={15} className="text-emerald-400" />
                      ) : (
                        <Lock size={14} className="text-[#FFD400]" />
                      )}
                      {m.title}
                    </div>
                    <p className="text-xs text-[#9299A6]">{m.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-[#FF303F]">+{m.reward} ●</div>
                    <div className="text-[10px] text-[#9299A6]">
                      {active ? 'ACTIVE' : 'CLICK TO TRACK'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- SETTINGS MENU --- */}
      {store.gameState === 'SETTINGS' && (
        <div className="max-w-md w-full bg-[#0B0D12] border border-[#FFD400]/50 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <button
              onClick={() => store.setGameState('MENU')}
              className="text-xs text-[#9299A6] hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft size={15} /> BACK
            </button>
            <h2 className="text-lg font-black text-white">SYSTEM SETTINGS</h2>
            <span />
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-[#9299A6] block mb-2">GRAPHICS QUALITY PRESET</label>
              <div className="grid grid-cols-3 gap-2">
                {(['LOW', 'MEDIUM', 'HIGH'] as QualityPreset[]).map((q) => (
                  <button
                    key={q}
                    onClick={() => store.setQuality(q)}
                    className={`py-2 rounded text-xs font-bold border cursor-pointer ${
                      store.quality === q
                        ? 'bg-[#FFD400] text-black border-[#FFD400]'
                        : 'bg-[#141820] text-white border-neutral-800'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between bg-[#141820] p-3 rounded-lg border border-neutral-800">
              <span className="text-xs text-white">SYNTH SOUND EFFECTS</span>
              <button
                onClick={() => store.updateAudioSettings(store.masterVolume, !store.sfxEnabled)}
                className="px-3 py-1.5 rounded bg-[#0B0D12] text-[#FFD400] border border-[#FFD400]/40 text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {store.sfxEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                {store.sfxEnabled ? 'ENABLED' : 'MUTED'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PAUSE MENU --- */}
      {store.gameState === 'PAUSED' && (
        <div className="max-w-sm w-full bg-[#0B0D12] border border-[#FFD400] rounded-2xl p-6 text-center space-y-4">
          <h2 className="text-2xl font-black text-white">SYSTEM PAUSED</h2>
          <button
            onClick={store.resumeGame}
            className="w-full py-3 bg-[#FFD400] text-black font-black rounded-xl text-xs cursor-pointer"
          >
            RESUME SESSION
          </button>
          <button
            onClick={() => store.startGame()}
            className="w-full py-3 bg-[#141820] text-white border border-neutral-700 font-bold rounded-xl text-xs cursor-pointer"
          >
            RESTART RUN
          </button>
          <button
            onClick={() => store.setGameState('MENU')}
            className="w-full py-3 bg-[#141820] text-[#9299A6] hover:text-white rounded-xl text-xs cursor-pointer"
          >
            MAIN MENU
          </button>
        </div>
      )}

      {/* --- GAME OVER SCREEN --- */}
      {store.gameState === 'GAMEOVER' && (
        <div className="max-w-md w-full bg-[#0B0D12] border-2 border-[#FF303F] rounded-2xl p-6 md:p-8 text-center space-y-6 shadow-[0_0_60px_rgba(255,48,63,0.25)]">
          <div className="space-y-1">
            <span className="text-[11px] text-[#FF303F] font-bold tracking-widest uppercase">
              CRITICAL CHASSIS IMPACT
            </span>
            <h2 className="text-3xl font-black text-white uppercase">RUN TERMINATED</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="bg-[#141820] p-3 rounded-lg border border-neutral-800">
              <div className="text-[10px] text-[#9299A6]">FINAL SCORE</div>
              <div className="text-xl font-black text-white">{store.score.toLocaleString()}</div>
            </div>
            <div className="bg-[#141820] p-3 rounded-lg border border-neutral-800">
              <div className="text-[10px] text-[#9299A6]">BEST RECORD</div>
              <div className="text-xl font-black text-[#FFD400]">
                {store.bestScore.toLocaleString()}
              </div>
            </div>
            <div className="bg-[#141820] p-3 rounded-lg border border-neutral-800">
              <div className="text-[10px] text-[#9299A6]">DISTANCE</div>
              <div className="text-lg font-bold text-white">{Math.floor(store.distance)}m</div>
            </div>
            <div className="bg-[#141820] p-3 rounded-lg border border-neutral-800">
              <div className="text-[10px] text-[#9299A6]">CORES HARVESTED</div>
              <div className="text-lg font-bold text-[#FF303F]">+{store.runCoins} ●</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => store.setGameState('MENU')}
              className="flex-1 py-3.5 bg-[#141820] hover:bg-neutral-800 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              MAIN MENU
            </button>
            <button
              onClick={() => store.startGame()}
              className="flex-1 py-3.5 bg-[#FFD400] hover:bg-[#FFEA70] text-black font-black rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(255,212,0,0.35)]"
            >
              <RotateCcw size={15} /> PLAY AGAIN [R]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}