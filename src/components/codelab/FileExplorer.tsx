import React, { useState, useRef, useEffect } from 'react';
import {
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Trash2,
  Edit2,
  Check,
  X,
  FolderPlus,
  FilePlus,
  Plus,
} from 'lucide-react';

export interface FileItem {
  id: string;
  name: string;
  path: string;
  content: string;
}

interface FileExplorerProps {
  files?: Record<string, FileItem>;
  activeFile: string;
  onSelectFile: (path: string) => void;
  onCreateFile: (path: string, content?: string) => void;
  onRenameFile: (oldPath: string, newPath: string) => void;
  onDeleteFile: (path: string) => void;
  width?: number;
  onWidthChange?: (newWidth: number) => void;
}

// Language Specific Badges & Colors
const getFileLanguageStyle = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  switch (ext) {
    case 'ts':
    case 'tsx':
      return { color: 'text-blue-400', label: 'TS', iconBg: 'bg-blue-500/10' };
    case 'js':
    case 'jsx':
      return { color: 'text-yellow-400', label: 'JS', iconBg: 'bg-yellow-500/10' };
    case 'py':
      return { color: 'text-sky-400', label: 'PY', iconBg: 'bg-sky-500/10' };
    case 'html':
      return { color: 'text-orange-500', label: 'HTML', iconBg: 'bg-orange-500/10' };
    case 'css':
    case 'scss':
      return { color: 'text-cyan-400', label: 'CSS', iconBg: 'bg-cyan-500/10' };
    case 'json':
      return { color: 'text-amber-300', label: 'JSON', iconBg: 'bg-amber-500/10' };
    case 'cpp':
    case 'c':
    case 'h':
      return { color: 'text-indigo-400', label: 'C++', iconBg: 'bg-indigo-500/10' };
    case 'java':
      return { color: 'text-red-400', label: 'JAVA', iconBg: 'bg-red-500/10' };
    case 'rs':
      return { color: 'text-orange-400', label: 'RS', iconBg: 'bg-orange-500/10' };
    case 'frag':
    case 'vert':
    case 'glsl':
      return { color: 'text-[#f5e642]', label: 'GLSL', iconBg: 'bg-[#f5e642]/10' };
    case 'md':
      return { color: 'text-purple-400', label: 'MD', iconBg: 'bg-purple-500/10' };
    default:
      return { color: 'text-neutral-400', label: 'FILE', iconBg: 'bg-neutral-500/10' };
  }
};

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files = {
    'src/main.ts': { id: '1', name: 'main.ts', path: 'src/main.ts', content: '// main code' },
    'src/style.css': { id: '2', name: 'style.css', path: 'src/style.css', content: '/* css */' },
    'shaders/scene.frag': { id: '3', name: 'scene.frag', path: 'shaders/scene.frag', content: '// shader' },
    'index.html': { id: '4', name: 'index.html', path: 'index.html', content: '<!-- html -->' },
  },
  activeFile,
  onSelectFile,
  onCreateFile,
  onRenameFile,
  onDeleteFile,
  width = 230,
  onWidthChange,
}) => {
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  
  // VS Code Direct Inline Folder/File Creation States
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFileIn, setIsCreatingFileIn] = useState<string | null>(null); // null = root
  const [newFileName, setNewFileName] = useState('');

  const [isResizing, setIsResizing] = useState(false);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCreatingFolder && folderInputRef.current) {
      folderInputRef.current.focus();
    }
  }, [isCreatingFolder]);

  useEffect(() => {
    if (isCreatingFileIn !== null && fileInputRef.current) {
      fileInputRef.current.focus();
    }
  }, [isCreatingFileIn]);

  // Handle Resize Panel
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(160, Math.min(450, moveEvent.clientX));
      if (onWidthChange) onWidthChange(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Submit Direct Folder Creation (VS Code Style)
  const submitNewFolder = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (newFolderName.trim()) {
      const cleanFolder = newFolderName.trim().replace(/\/$/, '');
      const placeholderPath = `${cleanFolder}/.keep`;
      onCreateFile(placeholderPath, '// Folder created');
      setCollapsedFolders((prev) => ({ ...prev, [cleanFolder]: false }));
    }
    setIsCreatingFolder(false);
    setNewFolderName('');
  };

  // Submit Direct File Creation
  const submitNewFile = (parentFolder: string | null, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (newFileName.trim()) {
      const cleanFileName = newFileName.trim();
      const fullPath = parentFolder ? `${parentFolder}/${cleanFileName}` : cleanFileName;
      onCreateFile(fullPath, `// File: ${cleanFileName}`);
      onSelectFile(fullPath);
    }
    setIsCreatingFileIn(null);
    setNewFileName('');
  };

  // Delete Folder Action
  const handleDeleteFolder = (folderPath: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete folder "${folderPath}" and all contained files?`)) {
      Object.keys(files).forEach((filePath) => {
        if (filePath.startsWith(folderPath + '/')) {
          onDeleteFile(filePath);
        }
      });
    }
  };

  // Inline File Rename Action
  const startRenaming = (path: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPath(path);
    setRenameValue(currentName);
  };

  const saveRename = (oldPath: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (renameValue.trim() && renameValue !== oldPath) {
      const dir = oldPath.includes('/') ? oldPath.substring(0, oldPath.lastIndexOf('/') + 1) : '';
      const newPath = dir + renameValue.trim();
      onRenameFile(oldPath, newPath);
    }
    setEditingPath(null);
  };

  const handleDeleteFile = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete file "${path}"?`)) {
      onDeleteFile(path);
    }
  };

  const toggleFolder = (folderPath: string) => {
    setCollapsedFolders((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath],
    }));
  };

  // Extract folder hierarchy dynamically
  const fileKeys = Object.keys(files);
  const folders = Array.from(
    new Set(
      fileKeys
        .filter((p) => p.includes('/'))
        .map((p) => p.substring(0, p.lastIndexOf('/')))
    )
  ).sort();

  const rootFiles = fileKeys.filter((p) => !p.includes('/') && !p.endsWith('.keep'));

  return (
    <aside
      style={{ width: `${width}px` }}
      className="bg-[#0d0e11] border-r border-[#1a1c23] p-2.5 text-xs font-mono text-neutral-400 flex flex-col justify-between shrink-0 h-full relative select-none"
    >
      <div>
        {/* Explorer Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1c1e24]">
          <span className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase">
            EXPLORER
          </span>
          <div className="flex items-center gap-1 text-neutral-400">
            <button
              onClick={() => {
                setIsCreatingFileIn('');
                setNewFileName('');
              }}
              className="p-1 hover:text-[#f5e642] hover:bg-[#1a1c23] rounded transition"
              title="New File"
            >
              <FilePlus size={13} />
            </button>
            <button
              onClick={() => {
                setIsCreatingFolder(true);
                setNewFolderName('');
              }}
              className="p-1 hover:text-[#f5e642] hover:bg-[#1a1c23] rounded transition"
              title="New Folder"
            >
              <FolderPlus size={13} />
            </button>
          </div>
        </div>

        {/* Dynamic VS Code Folder Tree */}
        <div className="space-y-1 text-[11px] overflow-y-auto max-h-[calc(100vh-180px)]">
          {/* Inline Direct New Folder Input */}
          {isCreatingFolder && (
            <form onSubmit={submitNewFolder} className="flex items-center gap-1.5 py-1 px-1 bg-[#15171d] rounded border border-[#f5e642]">
              <Folder size={13} className="text-[#f5e642] shrink-0" />
              <input
                ref={folderInputRef}
                type="text"
                placeholder="Folder Name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onBlur={() => submitNewFolder()}
                className="bg-transparent text-white text-[11px] outline-none w-full font-mono"
              />
            </form>
          )}

          {/* Render Folders */}
          {folders.map((folder) => {
            const isCollapsed = collapsedFolders[folder];
            const folderFiles = fileKeys.filter(
              (p) => p.startsWith(folder + '/') && p.split('/').length === folder.split('/').length + 1 && !p.endsWith('.keep')
            );

            return (
              <div key={folder} className="space-y-0.5">
                <div
                  onClick={() => toggleFolder(folder)}
                  className="group/folder flex items-center justify-between py-0.5 px-1 rounded cursor-pointer hover:bg-[#15171d] hover:text-white transition"
                >
                  <div className="flex items-center gap-1.5 text-neutral-300 font-semibold truncate">
                    {isCollapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
                    {isCollapsed ? (
                      <Folder size={13} className="text-[#f5e642]" />
                    ) : (
                      <FolderOpen size={13} className="text-[#f5e642]" />
                    )}
                    <span>{folder}/</span>
                  </div>

                  {/* Folder Controls */}
                  <div className="hidden group-hover/folder:flex items-center gap-1 text-neutral-500">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCreatingFileIn(folder);
                        setCollapsedFolders((prev) => ({ ...prev, [folder]: false }));
                      }}
                      className="hover:text-[#f5e642] transition p-0.5"
                      title="New File in Folder"
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteFolder(folder, e)}
                      className="hover:text-red-400 transition p-0.5"
                      title="Delete Folder"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Nested Files inside Folder */}
                {!isCollapsed && (
                  <div className="pl-3.5 space-y-0.5 border-l border-[#1c1e24] ml-2 mt-0.5">
                    {/* Inline New File Input inside Folder */}
                    {isCreatingFileIn === folder && (
                      <form onSubmit={(e) => submitNewFile(folder, e)} className="flex items-center gap-1 py-0.5 px-1 bg-[#15171d] rounded border border-[#f5e642]">
                        <input
                          ref={fileInputRef}
                          type="text"
                          placeholder="filename.ts"
                          value={newFileName}
                          onChange={(e) => setNewFileName(e.target.value)}
                          onBlur={(e) => submitNewFile(folder, e)}
                          className="bg-transparent text-white text-[11px] outline-none w-full font-mono"
                        />
                      </form>
                    )}

                    {folderFiles.map((path) => {
                      const file = files[path];
                      const isActive = activeFile === path;
                      const isEditing = editingPath === path;
                      const langStyle = getFileLanguageStyle(file.name);

                      return (
                        <div
                          key={path}
                          onClick={() => onSelectFile(path)}
                          onDoubleClick={(e) => startRenaming(path, file.name, e)}
                          className={`group flex items-center justify-between px-2 py-1 rounded cursor-pointer transition ${
                            isActive
                              ? 'text-[#f5e642] bg-[#f5e642]/10 font-medium'
                              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#15171d]'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                            <span
                              className={`text-[9px] font-black px-1 py-0.2 rounded border border-current shrink-0 ${langStyle.color} ${langStyle.iconBg}`}
                            >
                              {langStyle.label}
                            </span>

                            {isEditing ? (
                              <form onSubmit={(e) => saveRename(path, e)} className="flex items-center gap-1 flex-1">
                                <input
                                  type="text"
                                  value={renameValue}
                                  onChange={(e) => setRenameValue(e.target.value)}
                                  autoFocus
                                  className="bg-black text-white border border-[#f5e642] px-1 py-0.5 text-[11px] rounded outline-none w-full"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <button type="submit" className="text-emerald-400 hover:text-emerald-300">
                                  <Check size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingPath(null)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <X size={12} />
                                </button>
                              </form>
                            ) : (
                              <span className={`truncate text-[11px] ${isActive ? 'text-[#f5e642]' : 'text-neutral-300'}`}>
                                {file.name}
                              </span>
                            )}
                          </div>

                          {!isEditing && (
                            <div className="hidden group-hover:flex items-center gap-1.5 text-neutral-500 pl-1">
                              <button
                                onClick={(e) => startRenaming(path, file.name, e)}
                                className="hover:text-[#f5e642] transition"
                                title="Rename File"
                              >
                                <Edit2 size={11} />
                              </button>
                              <button
                                onClick={(e) => handleDeleteFile(path, e)}
                                className="hover:text-red-400 transition"
                                title="Delete File"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          )}

                          {isActive && !isEditing && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#f5e642] shrink-0 group-hover:hidden"></span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Root Level Files */}
          <div className="space-y-0.5 pt-1">
            {/* Inline New File Input in Root */}
            {isCreatingFileIn === '' && (
              <form onSubmit={(e) => submitNewFile('', e)} className="flex items-center gap-1 py-0.5 px-1 bg-[#15171d] rounded border border-[#f5e642] mb-1">
                <input
                  ref={fileInputRef}
                  type="text"
                  placeholder="index.ts"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onBlur={(e) => submitNewFile('', e)}
                  className="bg-transparent text-white text-[11px] outline-none w-full font-mono"
                />
              </form>
            )}

            {rootFiles.map((path) => {
              const file = files[path];
              const isActive = activeFile === path;
              const isEditing = editingPath === path;
              const langStyle = getFileLanguageStyle(file.name);

              return (
                <div
                  key={path}
                  onClick={() => onSelectFile(path)}
                  onDoubleClick={(e) => startRenaming(path, file.name, e)}
                  className={`group flex items-center justify-between px-2 py-1 rounded cursor-pointer transition ${
                    isActive
                      ? 'text-[#f5e642] bg-[#f5e642]/10 font-medium'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#15171d]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                    <span
                      className={`text-[9px] font-black px-1 py-0.2 rounded border border-current shrink-0 ${langStyle.color} ${langStyle.iconBg}`}
                    >
                      {langStyle.label}
                    </span>

                    {isEditing ? (
                      <form onSubmit={(e) => saveRename(path, e)} className="flex items-center gap-1 flex-1">
                        <input
                          type="text"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          autoFocus
                          className="bg-black text-white border border-[#f5e642] px-1 py-0.5 text-[11px] rounded outline-none w-full"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button type="submit" className="text-emerald-400 hover:text-emerald-300">
                          <Check size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingPath(null)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={12} />
                        </button>
                      </form>
                    ) : (
                      <span className={`truncate text-[11px] ${isActive ? 'text-[#f5e642]' : 'text-neutral-300'}`}>
                        {file.name}
                      </span>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="hidden group-hover:flex items-center gap-1.5 text-neutral-500 pl-1">
                      <button
                        onClick={(e) => startRenaming(path, file.name, e)}
                        className="hover:text-[#f5e642] transition"
                        title="Rename"
                      >
                        <Edit2 size={11} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteFile(path, e)}
                        className="hover:text-red-400 transition"
                        title="Delete"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  )}

                  {isActive && !isEditing && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f5e642] shrink-0 group-hover:hidden"></span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer System Details */}
      <div className="pt-2 border-t border-[#1c1e24] space-y-1 text-[9px] text-neutral-500">
        <div className="flex items-center justify-between">
          <span>WORKSPACE</span>
          <span className="text-[#f5e642] font-bold">VS-CODE RUNTIME</span>
        </div>
        <div className="flex items-center justify-between">
          <span>RAM VENDOR: CHROMIUM</span>
          <span>28.4 MB</span>
        </div>
      </div>

      {/* Resizable Width Handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-[#f5e642]/50 transition-all ${
          isResizing ? 'bg-[#f5e642]' : 'bg-transparent'
        }`}
        title="Drag to resize width"
      />
    </aside>
  );
};