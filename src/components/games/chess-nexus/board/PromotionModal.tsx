// src/components/games/chess-nexus/board/PromotionModal.tsx
'use client';

import React from 'react';
import { PromotionPiece } from '@/types/chess';
import { useChessStore } from '@/store/useChessStore';
import { PieceSVG } from './PieceSVG';

const PROMOTION_OPTIONS: { type: PromotionPiece; label: string }[] = [
  { type: 'q', label: 'Queen' },
  { type: 'r', label: 'Rook' },
  { type: 'b', label: 'Bishop' },
  { type: 'n', label: 'Knight' },
];

export function PromotionModal() {
  const pendingPromotion = useChessStore((s) => s.pendingPromotion);
  const completePromotion = useChessStore((s) => s.completePromotion);
  const cancelPromotion = useChessStore((s) => s.cancelPromotion);

  if (!pendingPromotion) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Choose promotion piece"
      className="absolute inset-0 z-30 flex items-center justify-center bg-[#08090B]/85 backdrop-blur-sm rounded-2xl"
    >
      <div className="bg-[#171A20] border-2 border-[#FFD400] rounded-xl p-5 shadow-[0_0_30px_rgba(255,212,0,0.3)] text-center">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#FFD400] mb-4">
          Promote Pawn To
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {PROMOTION_OPTIONS.map((opt) => (
            <button
              key={opt.type}
              type="button"
              onClick={() => completePromotion(opt.type)}
              className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[#111318] border border-white/10 hover:border-[#FFD400] hover:bg-[#FFD400]/10 transition-all"
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <PieceSVG
                  type={opt.type}
                  color={pendingPromotion.color}
                  className="w-10 h-10"
                />
              </div>
              <span className="text-[11px] font-semibold text-[#F5F5F5] mt-1">
                {opt.label}
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={cancelPromotion}
          className="mt-4 text-xs text-[#969BA6] hover:text-[#F5F5F5] underline"
        >
          Cancel Move
        </button>
      </div>
    </div>
  );
}