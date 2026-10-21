import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Check, X } from 'lucide-react';

interface CodeEditorProps {
  activeFileName?: string;
  code?: string;
  onChangeCode?: (newCode: string) => void;
  onSave?: () => void;
  height?: string | number;
}

const AI_KEYWORDS = [
  'import * as THREE from "three";',
  'import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";',
  'const scene = new THREE.Scene();',
  'const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);',
  'const renderer = new THREE.WebGLRenderer({ antialias: true });',
  'const geometry = new THREE.IcosahedronGeometry(2.8, 4);',
  'const material = new THREE.MeshStandardMaterial({ color: 0xf5e642, wireframe: true });',
  'function animate() { requestAnimationFrame(animate); }',
  'console.log("Code Lab v2.4 initialized");',
  'return',
  'export const',
  'interface Props',
  'async function',
];

export const CodeEditorArea: React.FC<CodeEditorProps> = ({
  activeFileName = 'main.ts',
  code = `import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// -- Kinetic Wireframe Matrix Controller -----------------------

const viewport = document.getElementById('canvas-viewport');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(65, 1.33, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ canvas: viewport, antialias: true });

const geometry = new THREE.IcosahedronGeometry(2.8, 4);

const material = new THREE.MeshStandardMaterial({
    color: 0xF5E642,
    wireframe: true,
    roughness: 0.12,
    metalness: 0.88
});

const quantumOrb = new THREE.Mesh(geometry, material);
scene.add(quantumOrb);
camera.position.z = 6.2;`,
  onChangeCode,
  onSave,
  height = '100%',
}) => {
  const [editorContent, setEditorContent] = useState(code);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSaveToast, setShowSaveToast] = useState(false);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionPos, setSuggestionPos] = useState<{ top: number; left: number } | null>(null);
  const [selectedSuggestionIdx, setSelectedSuggestionIdx] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    setEditorContent(code);
  }, [code]);

  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (onSave) onSave();
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 2000);
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault();
      setSearchOpen((prev) => !prev);
      return;
    }

    if (suggestions.length > 0 && (e.key === 'Tab' || e.key === 'Enter')) {
      e.preventDefault();
      applySuggestion(suggestions[selectedSuggestionIdx]);
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const val = target.value;

      const newText = val.substring(0, start) + '    ' + val.substring(end);
      setEditorContent(newText);
      if (onChangeCode) onChangeCode(newText);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setEditorContent(val);
    if (onChangeCode) onChangeCode(val);

    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = val.substring(0, cursorPos);
    const words = textBeforeCursor.split(/[\s,();]+/);
    const currentWord = words[words.length - 1] || '';

    if (currentWord.length >= 2) {
      const matches = AI_KEYWORDS.filter((k) =>
        k.toLowerCase().includes(currentWord.toLowerCase())
      );
      if (matches.length > 0) {
        setSuggestions(matches.slice(0, 4));
        setSuggestionPos({
          top: Math.min(220, textBeforeCursor.split('\n').length * 20),
          left: 60,
        });
        setSelectedSuggestionIdx(0);
      } else {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const applySuggestion = (suggestion: string) => {
    if (!textareaRef.current) return;
    const target = textareaRef.current;
    const cursorPos = target.selectionStart;
    const textBeforeCursor = editorContent.substring(0, cursorPos);
    const lastWordIdx = textBeforeCursor.search(/\S+$/);

    const newText =
      editorContent.substring(0, lastWordIdx > 0 ? lastWordIdx : cursorPos) +
      suggestion +
      editorContent.substring(cursorPos);

    setEditorContent(newText);
    if (onChangeCode) onChangeCode(newText);
    setSuggestions([]);
  };

  const lineCount = editorContent.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 15) }, (_, i) => i + 1);

  return (
    <div
      style={{ height }}
      className="flex-1 bg-[#090a0c] flex flex-col justify-between font-mono text-xs overflow-hidden select-none relative"
    >
      <div className="flex items-center justify-between bg-[#0d0e11] border-b border-[#1c1e24] px-2 pt-1 text-[11px] shrink-0">
        <div className="flex items-center">
          <div className="flex items-center gap-2 bg-[#090a0c] text-[#f5e642] px-3 py-1 rounded-t border-t-2 border-[#f5e642] font-semibold border-x border-[#1c1e24]">
            <span>{activeFileName}</span>
            <span className="text-[8px] text-[#f5e642]">●</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-neutral-400 pb-1">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-1 hover:text-[#f5e642] hover:bg-[#1c1e24] rounded transition"
            title="Search Code (Ctrl+F)"
          >
            <Search size={13} />
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="bg-[#12141a] border-b border-[#22242a] px-3 py-1.5 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 flex-1">
            <Search size={13} className="text-[#f5e642]" />
            <input
              type="text"
              placeholder="Search code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/50 text-white border border-[#2a2d37] px-2 py-0.5 rounded text-[11px] outline-none focus:border-[#f5e642] w-64 font-mono"
            />
          </div>
          <button onClick={() => setSearchOpen(false)} className="text-neutral-400 hover:text-white">
            <X size={13} />
          </button>
        </div>
      )}

      <div className="flex-1 relative overflow-hidden flex font-mono text-[12px] leading-6">
        <div className="w-10 bg-[#0a0b0e] border-r border-[#1a1c23] py-2 text-right pr-2 text-neutral-600 select-none shrink-0 font-mono text-[10px]">
          {lineNumbers.map((num) => (
            <div key={num} className="h-6 flex items-center justify-end">
              {num}
            </div>
          ))}
        </div>

        <div className="flex-1 relative h-full overflow-hidden">
          <pre
            ref={preRef}
            className="absolute inset-0 p-2 font-mono text-[12px] leading-6 overflow-auto pointer-events-none whitespace-pre text-neutral-200"
            dangerouslySetInnerHTML={{
              __html: editorContent
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/(import|export|from|const|let|var|function|return|new|async|await)/g, '<span class="text-purple-400 font-semibold">$1</span>')
                .replace(/('.*?'|".*?"|`.*?`)/g, '<span class="text-amber-300">$1</span>')
                .replace(/(\/\/.*)/g, '<span class="text-emerald-500/80 italic">$1</span>')
                .replace(/(THREE|Math|document|window)/g, '<span class="text-cyan-400">$1</span>')
                .replace(/(0x[0-9A-Fa-f]+|\b\d+\b)/g, '<span class="text-orange-400">$1</span>')
            }}
          />

          <textarea
            ref={textareaRef}
            value={editorContent}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            spellCheck={false}
            className="absolute inset-0 p-2 font-mono text-[12px] leading-6 bg-transparent text-transparent caret-[#f5e642] resize-none outline-none overflow-auto whitespace-pre w-full h-full"
          />

          {suggestions.length > 0 && suggestionPos && (
            <div
              style={{ top: `${suggestionPos.top}px`, left: `${suggestionPos.left}px` }}
              className="absolute z-50 bg-[#121318] border border-[#f5e642] shadow-xl rounded p-1.5 w-80 text-xs font-mono"
            >
              <div className="flex items-center gap-1.5 text-[10px] text-[#f5e642] font-bold border-b border-[#22242a] pb-1 mb-1">
                <Sparkles size={11} />
                <span>AI SUGGESTIONS (Press Tab or Enter)</span>
              </div>
              <div className="space-y-1">
                {suggestions.map((sugg, idx) => (
                  <div
                    key={idx}
                    onClick={() => applySuggestion(sugg)}
                    className={`px-2 py-1 rounded cursor-pointer truncate text-[11px] ${
                      idx === selectedSuggestionIdx
                        ? 'bg-[#f5e642] text-black font-semibold'
                        : 'text-neutral-300 hover:bg-[#1f212a]'
                    }`}
                  >
                    {sugg}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showSaveToast && (
        <div className="absolute bottom-10 right-4 bg-emerald-500 text-black font-extrabold px-3 py-1.5 rounded shadow-lg flex items-center gap-1.5 text-xs animate-bounce">
          <Check size={14} />
          <span>Code Saved Successfully!</span>
        </div>
      )}

      <div className="bg-[#0d0e11] border-t border-[#1c1e24] px-3 py-1 flex items-center justify-between text-[10px] text-neutral-500 font-mono shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[#f5e642] font-bold">✔ Ready</span>
          <span>Ln {editorContent.split('\n').length}, Col 1</span>
          <span>Spaces: 4</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-3">
          <span>TypeScript 5.4.2</span>
          <span>Prettier</span>
        </div>
      </div>
    </div>
  );
};