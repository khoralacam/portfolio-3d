// src/components/games/cyber-track/layout/CyberTrackShell.tsx
"use client";

import React, { useEffect, useRef } from 'react';
import { CyberTrackCanvas } from '../canvas/CyberTrackCanvas';
import { CyberHUD } from '../ui/CyberHUD';
import { CyberMenus } from '../ui/CyberMenus';
import { useCyberTrackStore } from '../store/useCyberTrackStore';
import { soundEngine } from '../audio/soundEngine';

export function CyberTrackShell() {
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = useCyberTrackStore.getState();

      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
        if (state.gameState === 'PLAYING') {
          e.preventDefault();
        }
      }

      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        state.moveLane(-1);
      } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        state.moveLane(1);
      } else if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') {
        state.activateNitro();
      } else if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        state.setBraking(true);
      } else if (e.code === 'KeyP' || e.code === 'Escape') {
        if (state.gameState === 'PLAYING') state.pauseGame();
        else if (state.gameState === 'PAUSED') state.resumeGame();
      } else if (e.code === 'KeyR' && state.gameState === 'GAMEOVER') {
        state.startGame();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        useCyberTrackStore.getState().setBraking(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      soundEngine.stopEngine();
    };
  }, []);

  return (
    <div
      className="relative w-full h-full min-h-[540px] bg-[#050608] overflow-hidden select-none touch-none"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(deltaX) > 40) {
          useCyberTrackStore.getState().moveLane(deltaX > 0 ? 1 : -1);
        }
        touchStartX.current = null;
      }}
    >
      <CyberTrackCanvas />
      <CyberHUD />
      <CyberMenus />
    </div>
  );
}