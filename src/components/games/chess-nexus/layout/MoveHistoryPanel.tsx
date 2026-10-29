// src/components/games/chess-nexus/layout/MoveHistoryPanel.tsx
'use client';

import React from 'react';
import { Undo2, RotateCcw, Flag, Handshake } from 'lucide-react';
import { useChessStore } from '@/store/useChessStore';
import { NexusCard } from '../ui/NexusCard';
import { NexusButton } from '../ui/NexusButton';

export function MoveHistoryPanel() {
  const history = useChessStore((s) => s.history);
  const status = useChessStore((s) => s.status);
  const turn = useChessStore((s) => s.turn);
  const undoMove = useChessStore((s) => s.undoMove);
  const resetGame = useChessStore((s) => s.resetGame);
  const resignGame = useChessStore((s) => s.resignGame);
  const offerDraw = useChessStore((s) => s.offerDraw);

  // Pair moves into Full Turns: [{ moveNumber: 1, white: 'e4', black: 'e5' }]
  const movePairs: { moveNumber: number; white?: string; black?: string }[] = [];
  for (let i = 0; i < history.length; i += 2) {
    movePairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: history[i]?.san,
      black: history[i + 1]?.san,
    });
  }

  return (
    <NexusCard className="h-[520px] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#FFD400]">
          Move History (SAN)
        </h2>
        <span className="text-xs text-[#969BA6] font-mono">
          {history.length} {history.length === 1 ? 'ply' : 'plies'}
        </span>
      </div>

      {/* Scrollable Move Table */}
      <div className="flex-1 overflow-y-auto my-3 pr-1 space-y-1 font-mono text-xs">
        {movePairs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[#969BA6] text-center px-4">
            Click or drag any White piece on the board to make the opening move.
          </div>
        ) : (
          movePairs.map((pair) => (
            <div
              key={pair.moveNumber}
              className="grid grid-cols-7 items-center py-1.5 px-2.5 rounded bg-[#111318] border border-white/5"
            >
              <span className="col-span-1 text-[#969BA6]">{pair.moveNumber}.</span>
              <span className="col-span-3 font-semibold text-[#F5F5F5]">
                {pair.white}
              </span>
              <span className="col-span-3 font-semibold text-[#FFD400]">
                {pair.black ?? ''}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Action Toolbar */}
      <div className="pt-3 border-t border-white/10 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <NexusButton
            variant="secondary"
            size="sm"
            onClick={undoMove}
            disabled={history.length === 0 || status !== 'active'}
          >
            <Undo2 className="w-3.5 h-3.5" />
            Undo
          </NexusButton>

          <NexusButton variant="secondary" size="sm" onClick={resetGame}>
            <RotateCcw className="w-3.5 h-3.5" />
            New Game
          </NexusButton>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <NexusButton
            variant="secondary"
            size="sm"
            onClick={offerDraw}
            disabled={status !== 'active' || history.length < 2}
          >
            <Handshake className="w-3.5 h-3.5" />
            Draw
          </NexusButton>

          <NexusButton
            variant="danger"
            size="sm"
            onClick={() => resignGame(turn)}
            disabled={status !== 'active'}
          >
            <Flag className="w-3.5 h-3.5" />
            Resign
          </NexusButton>
        </div>
      </div>
    </NexusCard>
  );
}