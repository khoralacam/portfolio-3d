'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { HeaderBar } from './HeaderBar';
import { FileExplorer } from './FileExplorer';
import { CodeEditorArea } from './CodeEditorArea';
import { LivePreview } from './LivePreview';
import { ConsoleOutput } from './ConsoleOutput';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';

export const CodeLabMain: React.FC = () => {
  const { saveActiveFile, setCommandPaletteOpen } = useWorkspaceStore();

  // Panel widths in percentages (Explorer | Editor | Right Pane)
  const [explorerWidth, setExplorerWidth] = useState<number>(18);
  const [rightPaneWidth, setRightPaneWidth] = useState<number>(38);
  // Right vertical split (LivePreview height % vs ConsoleOutput height %)
  const [previewHeight, setPreviewHeight] = useState<number>(62);

  const containerRef = useRef<HTMLDivElement>(null);
  const rightPaneRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<'left' | 'right' | 'vertical' | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggingRef.current) return;

    if (
      (draggingRef.current === 'left' || draggingRef.current === 'right') &&
      containerRef.current
    ) {
      const rect = containerRef.current.getBoundingClientRect();
      const relX = ((e.clientX - rect.left) / rect.width) * 100;

      if (draggingRef.current === 'left') {
        setExplorerWidth(Math.min(30, Math.max(12, relX)));
      } else if (draggingRef.current === 'right') {
        const fromRight = 100 - relX;
        setRightPaneWidth(Math.min(55, Math.max(24, fromRight)));
      }
    } else if (draggingRef.current === 'vertical' && rightPaneRef.current) {
      const rect = rightPaneRef.current.getBoundingClientRect();
      const relY = ((e.clientY - rect.top) / rect.height) * 100;
      setPreviewHeight(Math.min(82, Math.max(25, relY)));
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    draggingRef.current = null;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Global IDE Keyboard Shortcuts (Ctrl+S, Ctrl+Shift+P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveActiveFile();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveActiveFile, setCommandPaletteOpen]);

  const startDrag = (type: 'left' | 'right' | 'vertical') => {
    draggingRef.current = type;
    document.body.style.cursor =
      type === 'vertical' ? 'row-resize' : 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const editorWidth = 100 - explorerWidth - rightPaneWidth;

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#090909] text-[#F5F5F5] flex flex-col select-none">
      <HeaderBar />

      <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
        {/* Left Column: File Explorer */}
        <div style={{ width: `${explorerWidth}%` }} className="h-full shrink-0">
          <FileExplorer />
        </div>

        {/* Resizer 1 */}
        <div
          onMouseDown={() => startDrag('left')}
          className="w-[2px] bg-[#292929] hover:bg-[#FFD400] cursor-col-resize transition-colors shrink-0 z-20"
        />

        {/* Center Column: Monaco Editor */}
        <div style={{ width: `${editorWidth}%` }} className="h-full min-w-0">
          <CodeEditorArea />
        </div>

        {/* Resizer 2 */}
        <div
          onMouseDown={() => startDrag('right')}
          className="w-[2px] bg-[#292929] hover:bg-[#FFD400] cursor-col-resize transition-colors shrink-0 z-20"
        />

        {/* Right Split Column: Live Preview (Top) + Console Output (Bottom) */}
        <div
          ref={rightPaneRef}
          style={{ width: `${rightPaneWidth}%` }}
          className="h-full flex flex-col shrink-0 min-w-0"
        >
          <div style={{ height: `${previewHeight}%` }} className="w-full min-h-0">
            <LivePreview />
          </div>

          {/* Vertical Resizer */}
          <div
            onMouseDown={() => startDrag('vertical')}
            className="h-[2px] bg-[#292929] hover:bg-[#FFD400] cursor-row-resize transition-colors shrink-0 z-20"
          />

          <div
            style={{ height: `${100 - previewHeight}%` }}
            className="w-full min-h-0"
          >
            <ConsoleOutput />
          </div>
        </div>
      </div>
    </main>
  );
};

export default CodeLabMain;