// src/components/games/chess-nexus/ui/StatusBadge.tsx
import React from 'react';
import clsx from 'clsx';

interface StatusBadgeProps {
  online: boolean;
  label?: string;
}

export function StatusBadge({ online, label }: StatusBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#111318] border border-white/10 text-xs font-medium">
      <span
        className={clsx(
          'w-2 h-2 rounded-full',
          online
            ? 'bg-[#36D989] shadow-[0_0_8px_#36D989]'
            : 'bg-[#FF4545] shadow-[0_0_8px_#FF4545]'
        )}
      />
      <span className="text-[#969BA6]">
        {label ?? (online ? 'Network Ready' : 'Offline Mode')}
      </span>
    </div>
  );
}