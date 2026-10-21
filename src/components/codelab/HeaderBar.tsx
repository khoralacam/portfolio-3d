// src/components/codelab/HeaderBar.tsx
import React from 'react';
import { Play, RotateCcw, Copy, Maximize2, Minimize2 } from 'lucide-react';

interface HeaderBarProps {
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ isFullScreen, onToggleFullScreen }) => {
  return (
    <div className="bg-[#0d0e11] border-b border-[#1c1e24] px-4 py-2.5 flex items-center justify-between font-mono shrink-0">
      {/* Left Title / Branding */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
        </div>
        <span className="text-xs text-neutral-300 font-bold tracking-wider">CODE LAB WORKBENCH</span>
      </div>

      {/* Right Actions & Fullscreen Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => alert('Execution started')}
          className="flex items-center gap-1 bg-[#f5e642] text-black px-3 py-1 rounded text-xs font-bold hover:bg-[#ffe838] transition"
        >
          <Play size={11} fill="currentColor" />
          <span>RUN</span>
        </button>

        {onToggleFullScreen && (
          <button
            onClick={onToggleFullScreen}
            className="p-1.5 bg-[#16181e] border border-[#22242a] hover:border-[#f5e642]/50 text-neutral-300 hover:text-[#f5e642] rounded transition flex items-center justify-center cursor-pointer"
            title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
          >
            {isFullScreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        )}
      </div>
    </div>
  );
};