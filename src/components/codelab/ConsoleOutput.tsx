'use client';

import React, { useState } from 'react';
import { Ban, Trash2, Terminal as TerminalIcon, AlertCircle, Wifi } from 'lucide-react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { BottomTab } from '@/types/workspace';

export const ConsoleOutput: React.FC = () => {
  const {
    logs,
    problems,
    activeBottomTab,
    setBottomTab,
    clearLogs,
    executeTerminalCommand,
  } = useWorkspaceStore();

  const [cmdInput, setCmdInput] = useState('npm run build');

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeTerminalCommand(cmdInput);
    setCmdInput('');
  };

  const levelBadgeColor = (level: string) => {
    switch (level) {
      case 'INFO':
        return 'text-[#36D399]';
      case 'SUCCESS':
        return 'text-[#FFD400] font-bold';
      case 'VITE':
        return 'text-[#A3A3A3]';
      case 'WARN':
        return 'text-[#FFB020]';
      case 'ERROR':
        return 'text-[#FF4D4F]';
      default:
        return 'text-[#FFD400]';
    }
  };

  const tabs: { id: BottomTab; label: string; badge?: number }[] = [
    { id: 'CONSOLE', label: 'CONSOLE', badge: logs.length },
    { id: 'TERMINAL', label: 'TERMINAL' },
    { id: 'PROBLEMS', label: 'PROBLEMS', badge: problems.length },
    { id: 'NETWORK', label: 'NETWORK' },
  ];

  return (
    <section className="h-full bg-[#090909] border-t border-[#292929] flex flex-col justify-between font-mono text-xs select-none">
      {/* Tab Header */}
      <div className="h-8 bg-[#111111] border-b border-[#292929] px-2 flex items-center justify-between">
        <div className="flex items-center h-full">
          {tabs.map((tab) => {
            const isActive = activeBottomTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setBottomTab(tab.id)}
                className={`h-full px-3 flex items-center gap-1.5 border-r border-[#292929] text-[11px] transition-colors ${
                  isActive
                    ? 'bg-[#090909] text-[#FFD400] border-b-2 border-b-[#FFD400] font-bold'
                    : 'text-[#A3A3A3] hover:text-[#F5F5F5]'
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.badge === 'number' && (
                  <span className="px-1 py-0.2 bg-[#1f1d11] text-[#FFD400] rounded text-[10px]">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-[#A3A3A3]">
          <button
            onClick={clearLogs}
            title="Clear Console"
            className="p-1 hover:text-[#F5F5F5]"
          >
            <Ban className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={clearLogs}
            title="Delete Logs"
            className="p-1 hover:text-[#FF4D4F]"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log Stream Body */}
      <div className="flex-1 p-2.5 overflow-y-auto space-y-1.5 select-text">
        {activeBottomTab === 'CONSOLE' || activeBottomTab === 'TERMINAL' ? (
          logs.map((entry) => (
            <div key={entry.id} className="leading-relaxed text-[11px]">
              <span className={`${levelBadgeColor(entry.level)} mr-2`}>
                [{entry.level}]
              </span>
              <span className="text-[#A3A3A3] mr-2">{entry.timestamp}</span>
              <span
                className={
                  entry.level === 'SUCCESS'
                    ? 'text-[#FFD400] font-semibold'
                    : 'text-[#F5F5F5]'
                }
              >
                {entry.message}
              </span>
            </div>
          ))
        ) : activeBottomTab === 'PROBLEMS' ? (
          <div className="text-[#A3A3A3] flex items-center gap-2 py-2">
            <AlertCircle className="w-4 h-4 text-[#36D399]" />
            <span>No TypeScript or ESLint problems detected in workspace.</span>
          </div>
        ) : (
          <div className="text-[#A3A3A3] flex items-center gap-2 py-2">
            <Wifi className="w-4 h-4 text-[#FFD400]" />
            <span>Sandboxed iframe network isolation active. 0 external XHR requests.</span>
          </div>
        )}
      </div>

      {/* Interactive Command Prompt Bar */}
      <form
        onSubmit={handleCommandSubmit}
        className="h-8 bg-[#0d0d0d] border-t border-[#292929] px-3 flex items-center gap-2"
      >
        <TerminalIcon className="w-3.5 h-3.5 text-[#FFD400]" />
        <span className="text-[#FFD400] font-bold">&gt;</span>
        <input
          type="text"
          value={cmdInput}
          onChange={(e) => setCmdInput(e.target.value)}
          placeholder="Type a command (e.g. npm run build, ls, clear)..."
          className="w-full bg-transparent text-[#FFD400] text-xs focus:outline-none placeholder-[#525252]"
        />
      </form>
    </section>
  );
};