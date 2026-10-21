// src/components/codelab/CodeLabMain.tsx
import React, { useState } from 'react';
import { HeaderBar } from './HeaderBar';
import { FileExplorer } from './FileExplorer';
import { CodeEditorArea } from './CodeEditorArea';
import { LivePreview } from './LivePreview';
import { ConsoleOutput } from './ConsoleOutput';

export const CodeLabMain = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <section
      className={`transition-all duration-300 bg-[#0d0e11] font-mono flex flex-col ${
        isFullScreen
          ? 'fixed inset-0 z-50 w-screen h-screen rounded-none border-0 m-0'
          : 'w-full max-w-7xl mx-auto my-8 h-[700px] rounded-xl overflow-hidden border border-yellow-500/30 shadow-[0_0_40px_rgba(245,230,66,0.1)]'
      }`}
    >
      {/* Top Header Controls with Fullscreen Handler */}
      <HeaderBar 
        isFullScreen={isFullScreen} 
        onToggleFullScreen={() => setIsFullScreen(!isFullScreen)} 
      />

      {/* Main Workspace (Sidebar + Code Editor + Live Preview Canvas) */}
      <div className="flex flex-1 overflow-hidden">
        <FileExplorer />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            <CodeEditorArea />
            <LivePreview />
          </div>
          <ConsoleOutput />
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-[#08080a] px-4 py-1.5 border-t border-neutral-800 flex justify-between items-center text-[11px] text-neutral-500 font-mono shrink-0">
        <div>Ready | Ln 9, Col 42 | TypeScript 5.4.2</div>
        <div className="flex gap-4">
          <span className="text-emerald-400">● WEBGL 2.0 ACTIVE</span>
          <span>LATENCY: 14MS</span>
        </div>
      </div>
    </section>
  );
};