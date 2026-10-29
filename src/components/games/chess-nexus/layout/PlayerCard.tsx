// src/components/games/chess-nexus/layout/PlayerCard.tsx
import React from 'react';
import clsx from 'clsx';
import { PlayerInfo } from '@/types/chess';

function formatClock(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function PlayerCard({ player }: { player: PlayerInfo }) {
  return (
    <div
      className={clsx(
        'flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#171A20] border transition-all',
        player.isActiveTurn
          ? 'border-[#FFD400] shadow-[0_0_15px_rgba(255,212,0,0.12)]'
          : 'border-white/10'
      )}
    >
      <div className="flex items-center gap-3">
        {/* Initials Avatar */}
        <div
          className={clsx(
            'w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm border',
            player.color === 'w'
              ? 'bg-[#F5F5F5] text-[#08090B] border-white'
              : 'bg-[#08090B] text-[#FFD400] border-[#FFD400]'
          )}
        >
          {player.name.slice(0, 2).toUpperCase()}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-[#F5F5F5]">{player.name}</span>
            {player.isOnline !== undefined && (
              <span
                className={clsx(
                  'w-2 h-2 rounded-full',
                  player.isOnline ? 'bg-[#36D989]' : 'bg-[#969BA6]'
                )}
                title={player.isOnline ? 'Connected' : 'Offline'}
              />
            )}
          </div>
          <span className="text-xs text-[#969BA6]">
            Playing {player.color === 'w' ? 'White' : 'Black'}
          </span>
        </div>
      </div>

      {/* Digital Chess Clock */}
      <div
        className={clsx(
          'px-3 py-1.5 rounded-lg font-mono text-base font-bold tracking-wider border',
          player.isActiveTurn
            ? 'bg-[#FFD400] text-[#08090B] border-[#FFD400]'
            : 'bg-[#111318] text-[#969BA6] border-white/10'
        )}
      >
        {formatClock(player.timeRemainingMs)}
      </div>
    </div>
  );
}