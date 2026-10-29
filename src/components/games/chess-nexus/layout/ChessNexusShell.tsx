// src/components/games/chess-nexus/layout/ChessNexusShell.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Users,
  Globe,
  RotateCw,
  Eye,
  Trophy,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { AIDifficulty } from '@/types/chess';
import { useChessStore } from '@/store/useChessStore';
import { NexusButton } from '../ui/NexusButton';
import { NexusCard } from '../ui/NexusCard';
import { StatusBadge } from '../ui/StatusBadge';
import { Chessboard2D } from '../board/Chessboard2D';
import { PlayerCard } from './PlayerCard';
import { MoveHistoryPanel } from './MoveHistoryPanel';

const DIFFICULTIES: AIDifficulty[] = ['easy', 'medium', 'hard', 'expert'];

export function ChessNexusShell() {
  const mode = useChessStore((s) => s.mode);
  const aiDifficulty = useChessStore((s) => s.aiDifficulty);
  const humanColor = useChessStore((s) => s.humanColor);
  const isAiThinking = useChessStore((s) => s.isAiThinking);
  const orientation = useChessStore((s) => s.orientation);
  const showCoordinates = useChessStore((s) => s.showCoordinates);
  const turn = useChessStore((s) => s.turn);
  const status = useChessStore((s) => s.status);
  const winner = useChessStore((s) => s.winner);
  const isCheck = useChessStore((s) => s.isCheck);
  const whiteTimeMs = useChessStore((s) => s.whiteTimeMs);
  const blackTimeMs = useChessStore((s) => s.blackTimeMs);

  const setMode = useChessStore((s) => s.setMode);
  const setAiDifficulty = useChessStore((s) => s.setAiDifficulty);
  const setHumanColor = useChessStore((s) => s.setHumanColor);
  const flipBoard = useChessStore((s) => s.flipBoard);
  const toggleCoordinates = useChessStore((s) => s.toggleCoordinates);
  const tickClock = useChessStore((s) => s.tickClock);
  const resetGame = useChessStore((s) => s.resetGame);

  const [isBrowserOnline, setIsBrowserOnline] = useState<boolean>(true);

  useEffect(() => {
    setIsBrowserOnline(navigator.onLine);
    const handleOnline = () => setIsBrowserOnline(true);
    const handleOffline = () => setIsBrowserOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      tickClock(1000);
    }, 1000);
    return () => clearInterval(timer);
  }, [tickClock]);

  const topColor = orientation === 'w' ? 'b' : 'w';
  const bottomColor = orientation;

  const getPlayerLabel = (color: 'w' | 'b') => {
    if (mode === 'ai') {
      return color === humanColor
        ? `You (${color === 'w' ? 'White' : 'Black'})`
        : `Nexus AI (${aiDifficulty.toUpperCase()})`;
    }
    return color === 'w' ? 'Player 1 (White)' : 'Player 2 (Black)';
  };

  return (
    <div className="min-h-screen bg-[#08090B] text-[#F5F5F5] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#111318]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FFD400] flex items-center justify-center text-[#08090B] font-black text-lg shadow-[0_0_15px_rgba(255,212,0,0.4)]">
              ♞
            </div>
            <span className="font-extrabold tracking-wider text-lg text-[#F5F5F5]">
              CHESS <span className="text-[#FFD400]">NEXUS</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isAiThinking && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD400]/15 border border-[#FFD400] text-[#FFD400] text-xs font-bold uppercase tracking-wider animate-pulse">
                <Sparkles className="w-3.5 h-3.5" /> AI Thinking...
              </span>
            )}
            {isCheck && status === 'active' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4545]/20 border border-[#FF4545] text-[#FF4545] text-xs font-bold uppercase tracking-wider animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" /> Check!
              </span>
            )}
            <StatusBadge online={isBrowserOnline} />
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column */}
        <div className="lg:col-span-3 flex flex-col gap-4 order-2 lg:order-1">
          <NexusCard glow>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#FFD400] mb-3">
              Select Game Mode
            </h2>
            <div className="flex flex-col gap-2.5">
              <NexusButton
                variant={mode === 'ai' ? 'primary' : 'secondary'}
                fullWidth
                onClick={() => setMode('ai')}
              >
                <Cpu className="w-4 h-4" />
                Play vs AI (Offline Ready)
              </NexusButton>

              <NexusButton
                variant={mode === 'local' ? 'primary' : 'secondary'}
                fullWidth
                onClick={() => setMode('local')}
              >
                <Users className="w-4 h-4" />
                Local 2-Player
              </NexusButton>

              <NexusButton
                variant={mode === 'online' ? 'primary' : 'secondary'}
                fullWidth
                onClick={() => setMode('online')}
              >
                <Globe className="w-4 h-4" />
                Online Multiplayer
              </NexusButton>
            </div>
          </NexusCard>

          {/* AI Settings Panel (Only visible in Play vs AI mode) */}
          {mode === 'ai' && (
            <NexusCard>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#FFD400] mb-3">
                AI Engine Settings
              </h3>

              <p className="text-xs text-[#969BA6] mb-2">Difficulty Level</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {DIFFICULTIES.map((level) => (
                  <NexusButton
                    key={level}
                    size="sm"
                    variant={aiDifficulty === level ? 'primary' : 'secondary'}
                    onClick={() => setAiDifficulty(level)}
                    className="uppercase"
                  >
                    {level}
                  </NexusButton>
                ))}
              </div>

              <p className="text-xs text-[#969BA6] mb-2">Play As</p>
              <div className="grid grid-cols-2 gap-2">
                <NexusButton
                  size="sm"
                  variant={humanColor === 'w' ? 'primary' : 'secondary'}
                  onClick={() => setHumanColor('w')}
                >
                  White
                </NexusButton>
                <NexusButton
                  size="sm"
                  variant={humanColor === 'b' ? 'primary' : 'secondary'}
                  onClick={() => setHumanColor('b')}
                >
                  Black
                </NexusButton>
              </div>
            </NexusCard>
          )}

          <NexusCard>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#969BA6] mb-3">
              Board Controls
            </h3>
            <div className="flex flex-col gap-2">
              <NexusButton variant="secondary" size="sm" fullWidth onClick={flipBoard}>
                <RotateCw className="w-4 h-4" />
                Flip Board ({orientation === 'w' ? 'White' : 'Black'} Bottom)
              </NexusButton>
              <NexusButton
                variant="secondary"
                size="sm"
                fullWidth
                onClick={toggleCoordinates}
              >
                <Eye className="w-4 h-4" />
                {showCoordinates ? 'Hide Coordinates' : 'Show Coordinates'}
              </NexusButton>
            </div>
          </NexusCard>
        </div>

        {/* Center Board Column */}
        <div className="lg:col-span-6 flex flex-col items-center gap-3 order-1 lg:order-2">
          {status !== 'active' && (
            <div className="w-full max-w-[560px] flex items-center justify-between px-4 py-3 rounded-xl bg-[#FFD400]/15 border-2 border-[#FFD400] text-[#F5F5F5]">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-[#FFD400]" />
                <div>
                  <p className="text-sm font-bold text-[#FFD400] uppercase tracking-wider">
                    Game Over — {status.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-[#F5F5F5]">
                    {winner === 'draw'
                      ? 'Match ended in a Draw.'
                      : `${winner === 'w' ? 'White' : 'Black'} wins the match!`}
                  </p>
                </div>
              </div>
              <NexusButton size="sm" onClick={resetGame}>
                Rematch
              </NexusButton>
            </div>
          )}

          {/* Top Player Card */}
          <div className="w-full max-w-[560px]">
            <PlayerCard
              player={{
                name: getPlayerLabel(topColor),
                color: topColor,
                timeRemainingMs: topColor === 'w' ? whiteTimeMs : blackTimeMs,
                isActiveTurn: status === 'active' && turn === topColor,
              }}
            />
          </div>

          <Chessboard2D />

          {/* Bottom Player Card */}
          <div className="w-full max-w-[560px]">
            <PlayerCard
              player={{
                name: getPlayerLabel(bottomColor),
                color: bottomColor,
                isOnline: isBrowserOnline,
                timeRemainingMs: bottomColor === 'w' ? whiteTimeMs : blackTimeMs,
                isActiveTurn: status === 'active' && turn === bottomColor,
              }}
            />
          </div>
        </div>

        {/* Right Move History Column */}
        <div className="lg:col-span-3 flex flex-col gap-4 order-3">
          <MoveHistoryPanel />
        </div>

      </main>
    </div>
  );
}