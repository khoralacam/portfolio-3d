export type FileLanguage =
  | 'typescript'
  | 'javascript'
  | 'html'
  | 'css'
  | 'json'
  | 'markdown'
  | 'glsl'
  | 'python';

export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  language?: FileLanguage;
  content?: string;
  isDirty?: boolean;
  isOpen?: boolean;
  parentId: string | null;
  children?: string[];
}

export interface ConsoleLogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR' | 'VITE' | 'CMD';
  message: string;
}

export interface ProblemEntry {
  id: string;
  file: string;
  line: number;
  column: number;
  severity: 'error' | 'warning';
  message: string;
}

export type BottomTab = 'CONSOLE' | 'TERMINAL' | 'PROBLEMS' | 'NETWORK';
export type ViewportMode = 'desktop' | 'tablet' | 'mobile';