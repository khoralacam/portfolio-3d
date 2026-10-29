// src/components/games/cyber-track/ui/CyberHUD.tsx
"use client";

import React from 'react';
import { Pause, Zap, Shield, Magnet, Award, ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { useCyberTrackStore } from '../store/useCyberTrackStore';
import { MISSIONS_LIST } from '../types/cyberTrack';

export function CyberHUD() {
  const {
    gameState,
    gameMode,
    score,
    distance,
    speed,
    runCoins,
    health,
    nitroCharge,
    isNitroActive,
    hasShield,
    magnetTimeLeft,
    multiplierTimeLeft,
    timeTrialRemaining,
    activeMissionId,
    damageFlash,
    pauseGame,
    moveLane,
    activateNitro,
  } = useCyberTrackStore();

  if (gameState !== 'PLAYING') return null;

  const activeMission = MISSIONS_LIST.find((m) => m.id === activeMissionId);
  const displayKmh = Math.round(speed * 3.2);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 md:p-6 font-mono select-none">
      {/* Collision Red Damage Vignette */}
      {damageFlash > 0 && (
        <div
          className="absolute inset-0 bg-[#FF303F]/35 pointer-events-none transition-opacity"
          style={{ opacity: damageFlash }}
        />
      )}

      {/* --- TOP HUD BAR --- */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        {/* Score & Distance Panel */}
        <div className="bg-[#0B0D12]/90 border border-[#FFD400]/50 px-4 py-2.5 rounded-lg shadow-[0_0_20px_rgba(255,212,0,0.15)] flex items-center gap-6">
          <div>
            <div className="text-[10px] text-[#9299A6] uppercase">SCORE</div>
            <div className="text-xl md:text-2xl font-black text-white tracking-wider">
              {score.toLocaleString()}
            </div>
          </div>
          <div className="h-8 w-[1px] bg-neutral-800" />
          <div>
            <div className="text-[10px] text-[#9299A6] uppercase">DISTANCE</div>
            <div className="text-lg md:text-xl font-bold text-[#FFD400]">
              {Math.floor(distance)}m
            </div>
          </div>
          <div className="h-8 w-[1px] bg-neutral-800" />
          <div>
            <div className="text-[10px] text-[#9299A6] uppercase">ENERGY CORES</div>
            <div className="text-lg md:text-xl font-bold text-[#FF303F] flex items-center gap-1">
              ● {runCoins}
            </div>
          </div>
        </div>

        {/* Center Time Trial / Mission Objective */}
        {gameMode === 'TIME_TRIAL' && (
          <div className="bg-[#0B0D12]/90 border border-[#FF303F] px-4 py-2 rounded-lg text-center">
            <div className="text-[10px] text-[#9299A6]">TIME REMAINING</div>
            <div className="text-xl font-black text-[#FF303F]">
              {timeTrialRemaining.toFixed(1)}s
            </div>
          </div>
        )}

        {gameMode === 'MISSION' && activeMission && (
          <div className="bg-[#0B0D12]/90 border border-[#FFD400]/40 px-4 py-2 rounded-lg hidden md:block">
            <div className="text-[10px] text-[#FFD400] uppercase font-bold">
              MISSION // {activeMission.title}
            </div>
            <div className="text-xs text-white">{activeMission.description}</div>
          </div>
        )}

        {/* Right Armor Integrity & Pause */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="bg-[#0B0D12]/90 border border-neutral-800 px-3 py-2 rounded-lg flex items-center gap-1.5">
            <span className="text-[10px] text-[#9299A6] mr-1">ARMOR</span>
            {[1, 2, 3].map((h) => (
              <span
                key={h}
                className={`w-3 h-3 rounded-sm ${
                  h <= health ? 'bg-[#FFD400] shadow-[0_0_8px_#FFD400]' : 'bg-neutral-800'
                }`}
              />
            ))}
          </div>

          <button
            onClick={pauseGame}
            className="p-2.5 bg-[#0B0D12]/90 hover:bg-[#FFD400] text-white hover:text-black border border-neutral-700 rounded-lg transition cursor-pointer"
            title="Pause Game (P / ESC)"
          >
            <Pause size={18} />
          </button>
        </div>
      </div>

      {/* --- ACTIVE POWER-UP BADGES --- */}
      <div className="flex flex-wrap gap-2 self-center">
        {hasShield && (
          <div className="bg-[#0B0D12]/90 border border-cyan-400 text-cyan-300 px-3 py-1 rounded text-xs flex items-center gap-1.5">
            <Shield size={14} /> SHIELD ACTIVE
          </div>
        )}
        {magnetTimeLeft > 0 && (
          <div className="bg-[#0B0D12]/90 border border-purple-400 text-purple-300 px-3 py-1 rounded text-xs flex items-center gap-1.5">
            <Magnet size={14} /> MAGNET {magnetTimeLeft.toFixed(0)}s
          </div>
        )}
        {multiplierTimeLeft > 0 && (
          <div className="bg-[#0B0D12]/90 border border-[#FFD400] text-[#FFD400] px-3 py-1 rounded text-xs flex items-center gap-1.5">
            <Award size={14} /> 2X SCORE {multiplierTimeLeft.toFixed(0)}s
          </div>
        )}
      </div>

      {/* --- BOTTOM HUD: SPEEDOMETER, NITRO BAR & TOUCH CONTROLS --- */}
      <div className="space-y-4">
        {/* Mobile Touch Controls */}
        <div className="flex md:hidden items-center justify-between pointer-events-auto gap-4">
          <div className="flex gap-3">
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                moveLane(-1);
              }}
              onClick={() => moveLane(-1)}
              className="w-16 h-16 bg-[#0B0D12]/90 active:bg-[#FFD400] active:text-black border border-[#FFD400]/50 rounded-xl flex items-center justify-center text-white"
            >
              <ChevronLeft size={30} />
            </button>
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                moveLane(1);
              }}
              onClick={() => moveLane(1)}
              className="w-16 h-16 bg-[#0B0D12]/90 active:bg-[#FFD400] active:text-black border border-[#FFD400]/50 rounded-xl flex items-center justify-center text-white"
            >
              <ChevronRight size={30} />
            </button>
          </div>

          <button
            onTouchStart={(e) => {
              e.preventDefault();
              activateNitro();
            }}
            onClick={activateNitro}
            disabled={nitroCharge < 25}
            className={`px-5 h-16 rounded-xl font-black text-xs flex items-center gap-2 border ${
              nitroCharge >= 25
                ? 'bg-[#FFD400] text-black border-[#FFEA70] shadow-[0_0_20px_rgba(255,212,0,0.5)]'
                : 'bg-[#0B0D12]/80 text-neutral-500 border-neutral-800'
            }`}
          >
            <Flame size={20} /> NITRO
          </button>
        </div>

        {/* Speedometer & Nitro Gauge */}
        <div className="flex items-end justify-between gap-4">
          <div className="bg-[#0B0D12]/90 border border-neutral-800 px-4 py-3 rounded-lg w-56">
            <div className="flex items-center justify-between text-[10px] text-[#9299A6] mb-1">
              <span className="flex items-center gap-1 text-[#FFD400]">
                <Zap size={12} /> PLASMA NITRO [SPACE]
              </span>
              <span>{Math.round(nitroCharge)}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#141820] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-100 ${
                  isNitroActive ? 'bg-[#FF303F]' : 'bg-[#FFD400]'
                }`}
                style={{ width: `${nitroCharge}%` }}
              />
            </div>
          </div>

          <div className="bg-[#0B0D12]/90 border border-[#FFD400]/40 px-5 py-2.5 rounded-lg text-right">
            <div className="text-[10px] text-[#9299A6]">VELOCITY TELEMETRY</div>
            <div className="text-2xl md:text-3xl font-black text-white">
              {displayKmh} <span className="text-xs text-[#FFD400]">KM/H</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}