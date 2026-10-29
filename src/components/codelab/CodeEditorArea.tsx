'use client';

import React, { useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { X, CheckCircle2 } from 'lucide-react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';

export const CodeEditorArea: React.FC = () => {
  const {
    files,
    openTabIds,
    activeFileId,
    selectFile,
    closeTab,
    updateFileContent,
    saveActiveFile,
  } = useWorkspaceStore();

  const [cursorPos, setCursorPos] = useState({ lineNumber: 9, column: 42 });
  const activeFile = files[activeFileId];

  const handleEditorMount: OnMount = (editor, monaco) => {
    monaco.editor.defineTheme('khoralacam-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: 'FFD400' },
        { token: 'identifier', foreground: '38BDF8' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
      ],
      colors: {
        'editor.background': '#090909',
        'editor.foreground': '#F5F5F5',
        'editor.lineHighlightBackground': '#151515',
        'editorLineNumber.foreground': '#525252',
        'editorLineNumber.activeForeground': '#FFD400',
        'editorCursor.foreground': '#FFD400',
        'editor.selectionBackground': '#264F78',
      },
    });
    monaco.editor.setTheme('khoralacam-dark');

    editor.onDidChangeCursorPosition((e) => {
      setCursorPos({
        lineNumber: e.position.lineNumber,
        column: e.position.column,
      });
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      saveActiveFile();
    });
  };

  return (
    <section className="h-full bg-[#090909] flex flex-col justify-between font-mono select-none">
      {/* Open File Tabs */}
      <div className="h-9 bg-[#111111] border-b border-[#292929] flex items-center overflow-x-auto">
        {openTabIds.map((tabId) => {
          const tabFile = files[tabId];
          if (!tabFile) return null;
          const isActive = tabId === activeFileId;

          return (
            <div
              key={tabId}
              onClick={() => selectFile(tabId)}
              className={`group h-full px-3 flex items-center gap-2 border-r border-[#292929] cursor-pointer text-xs transition-colors ${
                isActive
                  ? 'bg-[#090909] text-[#FFD400] border-t-2 border-t-[#FFD400]'
                  : 'bg-[#111111] text-[#A3A3A3] hover:bg-[#151515] hover:text-[#F5F5F5]'
              }`}
            >
              <span>{tabFile.name}</span>
              {tabFile.isDirty && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD400]" />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tabId);
                }}
                className="opacity-0 group-hover:opacity-100 hover:text-[#FF4D4F] p-0.5 rounded"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Main Monaco Instance */}
      <div className="flex-1 relative">
        {activeFile ? (
          <Editor
            height="100%"
            language={activeFile.language === 'glsl' ? 'c' : activeFile.language}
            value={activeFile.content}
            theme="vs-dark"
            onMount={handleEditorMount}
            onChange={(val) => updateFileContent(activeFile.id, val ?? '')}
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              padding: { top: 12 },
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-[#A3A3A3]">
            Select a file from the Workspace Explorer to begin editing.
          </div>
        )}
      </div>

      {/* Bottom Editor Status Bar */}
      <div className="h-7 bg-[#111111] border-t border-[#292929] px-3 flex items-center justify-between text-[11px] text-[#A3A3A3]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-[#FFD400]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Ready
          </span>
          <span>
            Ln {cursorPos.lineNumber}, Col {cursorPos.column}
          </span>
          <span>Spaces: 4</span>
        </div>
        <div className="flex items-center gap-4">
          <span>TypeScript 5.4.2</span>
          <button
            onClick={saveActiveFile}
            className="hover:text-[#FFD400] transition-colors"
          >
            Prettier
          </button>
        </div>
      </div>
    </section>
  );
};