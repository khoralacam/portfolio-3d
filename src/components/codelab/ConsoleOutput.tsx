'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Trash2, ChevronUp, ChevronDown, CheckCircle, AlertCircle, Play } from 'lucide-react';

interface ConsoleOutputProps {
  onRunScript?: () => void;
}

interface LogEntry {
  id: string;
  type: 'output' | 'error' | 'success' | 'input';
  text: string;
  time: string;
}

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({ onRunScript }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'output' | 'terminal' | 'problems'>('terminal');
  const [inputCommand, setInputCommand] = useState('');
  
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', type: 'success', text: 'Code Lab v2.4 Terminal Initialized [WebGL 2.0 Active]', time: '03:42:00' },
    { id: '2', type: 'output', text: 'Type "help" to see available runtime commands.', time: '03:42:01' },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of logs
  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCommand.trim()) return;

    const currentTime = new Date().toLocaleTimeString();
    const cmd = inputCommand.trim().toLowerCase();

    // Add user command to logs
    const newLogs: LogEntry[] = [
      ...logs,
      { id: Date.now().toString(), type: 'input', text: `codelab@workspace % ${inputCommand}`, time: currentTime }
    ];

    // Command processing logic
    if (cmd === 'clear') {
      setLogs([]);
      setInputCommand('');
      return;
    } else if (cmd === 'help') {
      newLogs.push({
        id: (Date.now() + 1).toString(),
        type: 'output',
        text: 'Available commands:\n  • run     - Execute active script & render 3D viewport\n  • clear   - Clear terminal logs\n  • status  - Check system memory & FPS performance\n  • ls      - List workspace files\n  • help    - Show this help menu',
        time: currentTime
      });
    } else if (cmd === 'run') {
      newLogs.push({
        id: (Date.now() + 1).toString(),
        type: 'success',
        text: 'Executing script... Three.js context refreshed successfully.',
        time: currentTime
      });
      if (onRunScript) onRunScript();
    } else if (cmd === 'status') {
      newLogs.push({
        id: (Date.now() + 1).toString(),
        type: 'output',
        text: 'System Status: Memory 42.8MB / 512MB | FPS: 60 | Latency: 14ms | WebGL: Active',
        time: currentTime
      });
    } else if (cmd === 'ls') {
      newLogs.push({
        id: (Date.now() + 1).toString(),
        type: 'output',
        text: 'Files in workspace:\n  ├── main.ts (Active)\n  ├── style.css\n  └── index.html',
        time: currentTime
      });
    } else {
      newLogs.push({
        id: (Date.now() + 1).toString(),
        type: 'error',
        text: `zsh: command not found: ${inputCommand}. Type "help" for valid commands.`,
        time: currentTime
      });
    }

    setLogs(newLogs);
    setInputCommand('');
  };

  return (
    <div className={`bg-[#08080a] border-t border-[#1c1e24] flex flex-col font-mono text-xs transition-all duration-200 select-none shrink-0 ${isOpen ? 'h-48' : 'h-8'}`}>
      
      {/* Terminal Top Navigation Header */}
      <div className="flex items-center justify-between px-3 bg-[#0d0e11] border-b border-[#1c1e24] h-8 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setActiveTab('terminal'); setIsOpen(true); }}
            className={`font-bold transition flex items-center gap-1.5 text-[11px] ${activeTab === 'terminal' ? 'text-[#f5e642] border-b-2 border-[#f5e642] pb-0.5' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            <Terminal size={12} />
            <span>TERMINAL</span>
          </button>
          <button
            onClick={() => { setActiveTab('output'); setIsOpen(true); }}
            className={`font-bold transition text-[11px] ${activeTab === 'output' ? 'text-[#f5e642] border-b-2 border-[#f5e642] pb-0.5' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            OUTPUT
          </button>
          <button
            onClick={() => { setActiveTab('problems'); setIsOpen(true); }}
            className={`font-bold transition flex items-center gap-1 text-[11px] ${activeTab === 'problems' ? 'text-[#f5e642] border-b-2 border-[#f5e642] pb-0.5' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            <AlertCircle size={11} className="text-amber-400" />
            <span>PROBLEMS (0)</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {onRunScript && (
            <button
              onClick={onRunScript}
              className="flex items-center gap-1 bg-[#f5e642]/10 border border-[#f5e642]/30 text-[#f5e642] px-2 py-0.5 rounded text-[10px] hover:bg-[#f5e642]/20 transition"
              title="Run Script"
            >
              <Play size={10} />
              <span>Run</span>
            </button>
          )}
          <button
            onClick={() => setLogs([])}
            className="p-1 hover:text-[#f5e642] text-neutral-400 transition"
            title="Clear Terminal"
          >
            <Trash2 size={13} />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:text-[#f5e642] text-neutral-400 transition"
            title={isOpen ? 'Collapse Terminal' : 'Expand Terminal'}
          >
            {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>

      {/* Terminal Body Area */}
      {isOpen && (
        <div className="flex-1 flex flex-col justify-between overflow-hidden p-2.5 bg-[#08080a]">
          
          {/* Logs Viewport */}
          <div className="flex-1 overflow-y-auto space-y-1.5 text-[11px] pr-2">
            {activeTab === 'terminal' && (
              <>
                {logs.map((log) => (
                  <div key={log.id} className="leading-relaxed">
                    {log.type === 'input' ? (
                      <div className="text-[#f5e642] font-semibold">{log.text}</div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <span className="text-neutral-600 select-none">[{log.time}]</span>
                        {log.type === 'success' && <CheckCircle size={12} className="text-emerald-400 mt-0.5 shrink-0" />}
                        {log.type === 'error' && <AlertCircle size={12} className="text-red-400 mt-0.5 shrink-0" />}
                        <pre className={`whitespace-pre-wrap font-mono ${log.type === 'error' ? 'text-red-300' : log.type === 'success' ? 'text-emerald-300' : 'text-neutral-300'}`}>
                          {log.text}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={bottomRef} />
              </>
            )}

            {activeTab === 'output' && (
              <div className="text-neutral-300 space-y-1">
                <div className="text-neutral-500">[Server] Starting Webpack & Three.js compiler...</div>
                <div className="text-emerald-400">[Bundler] Compiled main.ts successfully in 142ms.</div>
                <div className="text-neutral-300">WebGLRenderer context initialized. Canvas viewport ready.</div>
              </div>
            )}

            {activeTab === 'problems' && (
              <div className="text-neutral-500 italic py-2">
                No syntax errors or warnings detected in workspace. All systems operational.
              </div>
            )}
          </div>

          {/* Interactive Command Input Form (VS Code Style) */}
          {activeTab === 'terminal' && (
            <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 pt-2 border-t border-[#16181e] mt-1">
              <span className="text-[#f5e642] font-bold select-none">codelab@workspace %</span>
              <input
                type="text"
                value={inputCommand}
                onChange={(e) => setInputCommand(e.target.value)}
                placeholder="Type command (e.g. 'help', 'run', 'status')..."
                className="flex-1 bg-transparent text-white outline-none font-mono text-[11px] placeholder:text-neutral-600"
                spellCheck={false}
                autoFocus
              />
            </form>
          )}

        </div>
      )}
    </div>
  );
};