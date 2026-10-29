// src/components/games/chess-nexus/ui/NexusCard.tsx
import React from 'react';
import clsx from 'clsx';

interface NexusCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function NexusCard({ children, className, glow = false }: NexusCardProps) {
  return (
    <div
      className={clsx(
        'bg-[#171A20] border border-white/10 rounded-xl p-4 text-[#F5F5F5]',
        glow && 'border-[#FFD400]/40 shadow-[0_0_25px_rgba(255,212,0,0.08)]',
        className
      )}
    >
      {children}
    </div>
  );
}