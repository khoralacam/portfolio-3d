import { create } from 'zustand';
import { FileNode, ConsoleLogEntry, ProblemEntry, BottomTab, ViewportMode, FileLanguage } from '@/types/workspace';

interface WorkspaceState {
  projectName: string;
  files: Record<string, FileNode>;
  openTabIds: string[];
  activeFileId: string;
  expandedFolders: Record<string, boolean>;
  logs: ConsoleLogEntry[];
  problems: ProblemEntry[];
  activeBottomTab: BottomTab;
  viewportMode: ViewportMode;
  isRunning: boolean;
  executionTimeMs: number;
  previewVersion: number;
  isCommandPaletteOpen: boolean;

  // Actions
  selectFile: (fileId: string) => void;
  closeTab: (fileId: string) => void;
  updateFileContent: (fileId: string, content: string) => void;
  saveActiveFile: () => void;
  saveAllFiles: () => void;
  createFileOrFolder: (parentId: string | null, name: string, type: 'file' | 'folder') => void;
  deleteNode: (nodeId: string) => void;
  renameNode: (nodeId: string, newName: string) => void;
  toggleFolder: (folderId: string) => void;
  runProject: () => void;
  resetWorkspace: () => void;
  addLog: (level: ConsoleLogEntry['level'], message: string) => void;
  clearLogs: () => void;
  executeTerminalCommand: (cmd: string) => void;
  setBottomTab: (tab: BottomTab) => void;
  setViewportMode: (mode: ViewportMode) => void;
  setProblems: (problems: ProblemEntry[]) => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

const detectLanguage = (filename: string): FileLanguage => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'css':
      return 'css';
    case 'html':
      return 'html';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    case 'frag':
    case 'vert':
      return 'glsl';
    default:
      return 'typescript';
  }
};

const INITIAL_FILES: Record<string, FileNode> = {
  'folder-src': {
    id: 'folder-src',
    name: 'src',
    path: 'src',
    type: 'folder',
    parentId: null,
  },
  'file-main-ts': {
    id: 'file-main-ts',
    name: 'main.ts',
    path: 'src/main.ts',
    type: 'file',
    language: 'typescript',
    parentId: 'folder-src',
    isDirty: true,
    content: `import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// — Kinetic Wireframe Matrix Controller ————————————————————————

const viewport = document.getElementById('canvas-viewport') as HTMLCanvasElement;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(65, 1.33, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: viewport, antialias: true, alpha: true });

const geometry = new THREE.IcosahedronGeometry(2.8, 1);

const material = new THREE.MeshStandardMaterial({
  color: 0xF5E642,
  wireframe: true,
  roughness: 0.12,
  metalness: 0.88
});

const quantumOrb = new THREE.Mesh(geometry, material);
scene.add(quantumOrb);

camera.position.z = 6.2;`,
  },
  'file-style-css': {
    id: 'file-style-css',
    name: 'style.css',
    path: 'src/style.css',
    type: 'file',
    language: 'css',
    parentId: 'folder-src',
    isDirty: false,
    content: `html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background: #0d0d0d;
  color: #f5f5f5;
  font-family: 'JetBrains Mono', monospace;
  overflow: hidden;
}

#canvas-viewport {
  width: 100%;
  height: 100%;
  display: block;
}`,
  },
  'file-index-html': {
    id: 'file-index-html',
    name: 'index.html',
    path: 'src/index.html',
    type: 'file',
    language: 'html',
    parentId: 'folder-src',
    isDirty: false,
    content: `<canvas id="canvas-viewport"></canvas>`,
  },
  'folder-shaders': {
    id: 'folder-shaders',
    name: 'shaders',
    path: 'shaders',
    type: 'folder',
    parentId: null,
  },
  'file-scene-frag': {
    id: 'file-scene-frag',
    name: 'scene.frag',
    path: 'shaders/scene.frag',
    type: 'file',
    language: 'glsl',
    parentId: 'folder-shaders',
    isDirty: false,
    content: `precision highp float;
varying vec3 vNormal;

void main() {
  vec3 accent = vec3(1.0, 0.83, 0.0);
  gl_FragColor = vec4(accent, 1.0);
}`,
  },
  'file-particles-vert': {
    id: 'file-particles-vert',
    name: 'particles.vert',
    path: 'shaders/particles.vert',
    type: 'file',
    language: 'glsl',
    parentId: 'folder-shaders',
    isDirty: false,
    content: `attribute vec3 position;
void main() {
  gl_Position = vec4(position, 1.0);
}`,
  },
  'folder-public': {
    id: 'folder-public',
    name: 'public',
    path: 'public',
    type: 'folder',
    parentId: null,
  },
  'file-package-json': {
    id: 'file-package-json',
    name: 'package.json',
    path: 'package.json',
    type: 'file',
    language: 'json',
    parentId: null,
    isDirty: false,
    content: `{
  "name": "webgl-orb",
  "version": "2.4.0",
  "private": true,
  "dependencies": {
    "three": "^0.170.0"
  }
}`,
  },
  'file-tsconfig-json': {
    id: 'file-tsconfig-json',
    name: 'tsconfig.json',
    path: 'tsconfig.json',
    type: 'file',
    language: 'json',
    parentId: null,
    isDirty: false,
    content: `{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "strict": true
  }
}`,
  },
};

const formatTime = () => {
  const now = new Date();
  return (
    now.toTimeString().split(' ')[0] +
    '.' +
    String(now.getMilliseconds()).padStart(3, '0')
  );
};

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  projectName: 'projects / webgl-orb',
  files: INITIAL_FILES,
  openTabIds: ['file-main-ts', 'file-scene-frag', 'file-style-css'],
  activeFileId: 'file-main-ts',
  expandedFolders: {
    'folder-src': true,
    'folder-shaders': true,
    'folder-public': false,
  },
  logs: [
    {
      id: 'log-1',
      timestamp: '12:44:01.002',
      level: 'INFO',
      message: 'Initializing WebGLRenderer & Context...',
    },
    {
      id: 'log-2',
      timestamp: '12:44:01.018',
      level: 'INFO',
      message: 'Shader compiled successfully (0 errors, 0 warnings).',
    },
    {
      id: 'log-3',
      timestamp: '12:44:01.034',
      level: 'SUCCESS',
      message: 'Render loop operational. 60 FPS locked, delta: 16.6ms.',
    },
    {
      id: 'log-4',
      timestamp: '12:44:01.040',
      level: 'VITE',
      message: 'hmr update /src/main.ts (hot reload 2ms)',
    },
  ],
  problems: [],
  activeBottomTab: 'CONSOLE',
  viewportMode: 'desktop',
  isRunning: false,
  executionTimeMs: 4,
  previewVersion: 1,
  isCommandPaletteOpen: false,

  selectFile: (fileId) =>
    set((state) => {
      const node = state.files[fileId];
      if (!node || node.type === 'folder') return state;
      const isAlreadyOpen = state.openTabIds.includes(fileId);
      return {
        activeFileId: fileId,
        openTabIds: isAlreadyOpen ? state.openTabIds : [...state.openTabIds, fileId],
      };
    }),

  closeTab: (fileId) =>
    set((state) => {
      const nextTabs = state.openTabIds.filter((id) => id !== fileId);
      let nextActive = state.activeFileId;
      if (state.activeFileId === fileId) {
        nextActive = nextTabs[nextTabs.length - 1] || '';
      }
      return {
        openTabIds: nextTabs,
        activeFileId: nextActive,
      };
    }),

  updateFileContent: (fileId, content) =>
    set((state) => {
      const target = state.files[fileId];
      if (!target) return state;
      return {
        files: {
          ...state.files,
          [fileId]: {
            ...target,
            content,
            isDirty: true,
          },
        },
      };
    }),

  saveActiveFile: () => {
    const { activeFileId, files, addLog } = get();
    const active = files[activeFileId];
    if (!active) return;
    set((state) => ({
      files: {
        ...state.files,
        [activeFileId]: { ...active, isDirty: false },
      },
      previewVersion: state.previewVersion + 1,
    }));
    addLog('VITE', `hmr update /${active.path} (saved & reloaded)`);
  },

  saveAllFiles: () => {
    set((state) => {
      const updated: Record<string, FileNode> = {};
      Object.entries(state.files).forEach(([k, v]) => {
        updated[k] = { ...v, isDirty: false };
      });
      return { files: updated, previewVersion: state.previewVersion + 1 };
    });
    get().addLog('SUCCESS', 'All workspace files saved to IndexedDB storage.');
  },

  createFileOrFolder: (parentId, name, type) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const id = `${type}-${Date.now()}`;
    const parent = parentId ? get().files[parentId] : null;
    const path = parent ? `${parent.path}/${trimmed}` : trimmed;

    const newNode: FileNode = {
      id,
      name: trimmed,
      path,
      type,
      parentId,
      language: type === 'file' ? detectLanguage(trimmed) : undefined,
      content: type === 'file' ? `// ${trimmed}\n` : undefined,
      isDirty: false,
    };

    set((state) => ({
      files: { ...state.files, [id]: newNode },
      openTabIds: type === 'file' ? [...state.openTabIds, id] : state.openTabIds,
      activeFileId: type === 'file' ? id : state.activeFileId,
      expandedFolders:
        type === 'folder'
          ? { ...state.expandedFolders, [id]: true }
          : state.expandedFolders,
    }));
  },

  deleteNode: (nodeId) =>
    set((state) => {
      const nextFiles = { ...state.files };
      // Delete node and any direct children
      Object.values(nextFiles).forEach((node) => {
        if (node.id === nodeId || node.parentId === nodeId) {
          delete nextFiles[node.id];
        }
      });
      const nextTabs = state.openTabIds.filter((id) => Boolean(nextFiles[id]));
      const nextActive = nextFiles[state.activeFileId]
        ? state.activeFileId
        : nextTabs[0] || '';
      return {
        files: nextFiles,
        openTabIds: nextTabs,
        activeFileId: nextActive,
      };
    }),

  renameNode: (nodeId, newName) =>
    set((state) => {
      const target = state.files[nodeId];
      if (!target || !newName.trim()) return state;
      const clean = newName.trim();
      const parent = target.parentId ? state.files[target.parentId] : null;
      const newPath = parent ? `${parent.path}/${clean}` : clean;
      return {
        files: {
          ...state.files,
          [nodeId]: {
            ...target,
            name: clean,
            path: newPath,
            language: target.type === 'file' ? detectLanguage(clean) : undefined,
          },
        },
      };
    }),

  toggleFolder: (folderId) =>
    set((state) => ({
      expandedFolders: {
        ...state.expandedFolders,
        [folderId]: !state.expandedFolders[folderId],
      },
    })),

  runProject: () => {
    const start = performance.now();
    set({ isRunning: true });
    get().addLog('INFO', 'Bundling modules and executing sandboxed runtime...');
    setTimeout(() => {
      const elapsed = Math.max(2, Math.round(performance.now() - start));
      set((state) => ({
        isRunning: false,
        executionTimeMs: elapsed,
        previewVersion: state.previewVersion + 1,
      }));
      get().addLog(
        'SUCCESS',
        `Runtime execution complete in ${elapsed}ms. 60 FPS locked.`
      );
    }, 120);
  },

  resetWorkspace: () => {
    set({
      files: INITIAL_FILES,
      openTabIds: ['file-main-ts', 'file-scene-frag', 'file-style-css'],
      activeFileId: 'file-main-ts',
      previewVersion: get().previewVersion + 1,
    });
    get().addLog('WARN', 'Workspace reset to initial starter state.');
  },

  addLog: (level, message) =>
    set((state) => ({
      logs: [
        ...state.logs,
        {
          id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          timestamp: formatTime(),
          level,
          message,
        },
      ],
    })),

  clearLogs: () => set({ logs: [] }),

  executeTerminalCommand: (rawCmd) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;
    get().addLog('CMD', `> ${cmd}`);

    if (cmd === 'clear' || cmd === 'cls') {
      get().clearLogs();
      return;
    }
    if (cmd === 'npm run build') {
      get().addLog('INFO', 'vite v5.4.10 building for production...');
      get().addLog('SUCCESS', '✓ 14 modules transformed. dist/index.html 1.42 kB | gzip: 0.68 kB');
      return;
    }
    if (cmd === 'npm test') {
      get().addLog('SUCCESS', 'PASS src/main.ts (3 passed in 14ms)');
      return;
    }
    if (cmd === 'ls' || cmd === 'dir') {
      const rootNames = Object.values(get().files)
        .filter((f) => f.parentId === null)
        .map((f) => (f.type === 'folder' ? `${f.name}/` : f.name))
        .join('  ');
      get().addLog('INFO', rootNames);
      return;
    }
    if (cmd === 'help') {
      get().addLog(
        'INFO',
        'Available sandboxed commands: npm run build, npm test, ls, clear, help'
      );
      return;
    }
    get().addLog(
      'WARN',
      `Command "${cmd}" executed in browser sandbox simulation. Connect backend runner for full OS shell.`
    );
  },

  setBottomTab: (tab) => set({ activeBottomTab: tab }),
  setViewportMode: (mode) => set({ viewportMode: mode }),
  setProblems: (problems) => set({ problems }),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
}));