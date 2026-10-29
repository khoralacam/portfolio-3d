'use client';

import React, { useState } from 'react';
import {
  Zap,
  Copy,
  RotateCcw,
  Maximize2,
  Play,
  Check,
  Search,
} from 'lucide-react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';

export const HeaderBar: React.FC = () => {
  const {
    projectName,
    files,
    activeFileId,
    executionTimeMs,
    runProject,
    resetWorkspace,
    setCommandPaletteOpen,
  } = useWorkspaceStore();

  const [copied, setCopied] = useState(false);
  const activeFile = files[activeFileId];

  const handleCopyCode = async () => {
    if (!activeFile?.content) return;
    await navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="h-11 bg-[#090909] border-b border-[#292929] px-3 flex items-center justify-between select-none font-mono text-xs text-[#F5F5F5]">
      {/* Left Brand & Active Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-[#151515] border border-[#292929] px-2.5 py-1 rounded-sm">
          <span className="w-2 h-2 rounded-full bg-[#FFD400] animate-pulse" />
          <span className="font-bold tracking-wider text-[#F5F5F5]">
            CODE LAB v2.4
          </span>
          <span className="text-[#A3A3A3]">// SANDBOXED RUNTIME</span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-[#A3A3A3]">
          <span>{projectName}</span>
          <span>/</span>
          <span className="text-[#FFD400] font-semibold">
            {activeFile ? activeFile.name : 'none'}
          </span>
        </div>
      </div>

      {/* Center Runtime Badges */}
      <div className="hidden xl:flex items-center gap-2">
        <span className="px-2 py-0.5 bg-[#111111] border border-[#292929] rounded-sm text-[11px] text-[#A3A3A3] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#36D399]" />
          NODE 20.11
        </span>
        <span className="px-2 py-0.5 bg-[#111111] border border-[#292929] rounded-sm text-[11px] text-[#A3A3A3] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
          TS 5.4.2
        </span>
        <span className="px-2 py-0.5 bg-[#111111] border border-[#292929] rounded-sm text-[11px] text-[#A3A3A3] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFD400]" />
          WEBGL 2.0
        </span>
      </div>

      {/* Right Controls & Primary Yellow Run Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          title="Command Palette (Ctrl+Shift+P)"
          className="px-2 py-1 bg-[#151515] hover:bg-[#1f1f1f] border border-[#292929] rounded-sm text-[#A3A3A3] hover:text-[#F5F5F5] flex items-center gap-1.5 transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">CMD</span>
        </button>

        <div className="px-2 py-1 bg-[#151515] border border-[#292929] rounded-sm text-[#FFB020] flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>{executionTimeMs}ms</span>
        </div>

        <button
          onClick={handleCopyCode}
          className="px-2.5 py-1 bg-[#151515] hover:bg-[#1f1f1f] border border-[#292929] rounded-sm text-[#A3A3A3] hover:text-[#F5F5F5] flex items-center gap-1.5 transition-colors"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-[#36D399]" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          <span>{copied ? 'COPIED' : 'COPY'}</span>
        </button>

        <button
          onClick={resetWorkspace}
          className="px-2.5 py-1 bg-[#151515] hover:bg-[#1f1f1f] border border-[#292929] rounded-sm text-[#A3A3A3] hover:text-[#F5F5F5] flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET</span>
        </button>

        <button
          onClick={handleFullscreen}
          title="Toggle Fullscreen"
          className="p-1.5 bg-[#151515] hover:bg-[#1f1f1f] border border-[#292929] rounded-sm text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={runProject}
          className="px-3.5 py-1 bg-[#FFD400] hover:bg-[#FFE45C] text-[#090909] font-bold rounded-sm flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>RUN SCRIPT</span>
        </button>
      </div>
    </header>
  );
};