// src/components/games/chess-nexus/board/Chessboard2D.tsx
'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import { FileChar, RankChar, Square } from '@/types/chess';
import { useChessStore } from '@/store/useChessStore';
import { PieceSVG } from './PieceSVG';
import { PromotionModal } from './PromotionModal';

const FILES: FileChar[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS: RankChar[] = ['8', '7', '6', '5', '4', '3', '2', '1'];

export function Chessboard2D() {
  // Subscribe to Zustand store state
  const fen = useChessStore((s) => s.fen); // Triggers re-render on every move
  const orientation = useChessStore((s) => s.orientation);
  const showCoordinates = useChessStore((s) => s.showCoordinates);
  const selectedSquare = useChessStore((s) => s.selectedSquare);
  const legalTargets = useChessStore((s) => s.legalTargets);
  const lastMove = useChessStore((s) => s.lastMove);
  const isCheck = useChessStore((s) => s.isCheck);
  const turn = useChessStore((s) => s.turn);
  const selectSquare = useChessStore((s) => s.selectSquare);
  const movePiece = useChessStore((s) => s.movePiece);
  const getPieceAt = useChessStore((s) => s.getPieceAt);

  const [draggedFrom, setDraggedFrom] = useState<Square | null>(null);

  const displayRanks = orientation === 'w' ? RANKS : [...RANKS].reverse();
  const displayFiles = orientation === 'w' ? FILES : [...FILES].reverse();

  return (
    <div
      data-fen={fen}
      className="relative w-full max-w-[560px] aspect-square p-2 sm:p-3 rounded-2xl bg-[#171A20] border-2 border-[#FFD400]/40 shadow-[0_0_35px_rgba(0,0,0,0.8)]"
    >
      {/* Pawn Promotion Modal Overlay */}
      <PromotionModal />

      <div
        role="grid"
        aria-label="Playable Chessboard"
        className="w-full h-full grid grid-cols-8 grid-rows-8 rounded-xl overflow-hidden border border-white/10"
      >
        {displayRanks.map((rank, rIdx) =>
          displayFiles.map((file, fIdx) => {
            const square = `${file}${rank}` as Square;
            const isLight = (FILES.indexOf(file) + RANKS.indexOf(rank)) % 2 === 0;
            const piece = getPieceAt(square);

            const isSelected = selectedSquare === square;
            const isLastMove =
              lastMove?.from === square || lastMove?.to === square;
            const legalTarget = legalTargets.find((t) => t.to === square);
            const isKingInCheck =
              isCheck && piece?.type === 'k' && piece?.color === turn;

            return (
              <div
                key={square}
                role="gridcell"
                tabIndex={0}
                aria-label={`Square ${square}${
                  piece
                    ? `, ${piece.color === 'w' ? 'White' : 'Black'} ${piece.type}`
                    : ''
                }${legalTarget ? ', legal move target' : ''}`}
                onClick={() => selectSquare(square)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectSquare(square);
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (draggedFrom && draggedFrom !== square) {
                    movePiece(draggedFrom, square);
                  }
                  setDraggedFrom(null);
                }}
                className={clsx(
                  'relative flex items-center justify-center w-full h-full cursor-pointer select-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FFD400]',
                  isLight ? 'bg-[#2A2E39]' : 'bg-[#111318]',
                  isLastMove && !isSelected && 'bg-[#FFD400]/20',
                  isSelected && 'bg-[#FFD400]/30 ring-2 ring-inset ring-[#FFD400]',
                  isKingInCheck &&
                    'bg-[#FF4545]/45 ring-2 ring-inset ring-[#FF4545] shadow-[inset_0_0_18px_#FF4545]'
                )}
              >
                {/* Rank Coordinate on Left Edge */}
                {showCoordinates && fIdx === 0 && (
                  <span
                    className={clsx(
                      'absolute top-1 left-1.5 text-[10px] font-bold leading-none pointer-events-none',
                      isLight ? 'text-[#969BA6]' : 'text-[#FFD400]/70'
                    )}
                  >
                    {rank}
                  </span>
                )}

                {/* File Coordinate on Bottom Edge */}
                {showCoordinates && rIdx === 7 && (
                  <span
                    className={clsx(
                      'absolute bottom-1 right-1.5 text-[10px] font-bold leading-none uppercase pointer-events-none',
                      isLight ? 'text-[#969BA6]' : 'text-[#FFD400]/70'
                    )}
                  >
                    {file}
                  </span>
                )}

                {/* Legal Move Dot (Empty Square) */}
                {legalTarget && !legalTarget.isCapture && (
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FFD400] shadow-[0_0_10px_#FFD400] pointer-events-none z-10" />
                )}

                {/* Legal Capture Ring (Occupied Square) */}
                {legalTarget && legalTarget.isCapture && (
                  <span className="absolute inset-1 rounded-full border-4 border-[#FFD400]/85 shadow-[0_0_12px_rgba(255,212,0,0.6)] pointer-events-none z-10" />
                )}

                {/* Render Draggable Piece */}
                {piece && (
                  <div
                    draggable={piece.color === turn}
                    onDragStart={() => {
                      setDraggedFrom(square);
                      if (selectedSquare !== square) {
                        selectSquare(square);
                      }
                    }}
                    className={clsx(
                      'w-full h-full flex items-center justify-center',
                      piece.color === turn ? 'cursor-grab active:cursor-grabbing' : ''
                    )}
                  >
                    <PieceSVG type={piece.type} color={piece.color} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}