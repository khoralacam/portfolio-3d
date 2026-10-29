'use client';

import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  FileCode,
  FileJson,
  FileText,
  FilePlus,
  FolderPlus,
  Trash2,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { FileNode } from '@/types/workspace';

export const FileExplorer: React.FC = () => {
  const {
    files,
    activeFileId,
    expandedFolders,
    selectFile,
    toggleFolder,
    createFileOrFolder,
    deleteNode,
  } = useWorkspaceStore();

  const [creatingType, setCreatingType] = useState<'file' | 'folder' | null>(null);
  const [newName, setNewName] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatingType || !newName.trim()) {
      setCreatingType(null);
      return;
    }
    createFileOrFolder(null, newName, creatingType);
    setNewName('');
    setCreatingType(null);
  };

  const renderFileIcon = (node: FileNode) => {
    if (node.name.endsWith('.ts') || node.name.endsWith('.tsx')) {
      return <span className="text-[#FFD400] font-bold text-[10px] w-4">TS</span>;
    }
    if (node.name.endsWith('.css')) {
      return <span className="text-[#38BDF8] font-bold text-[10px] w-4">CSS</span>;
    }
    if (node.name.endsWith('.html')) {
      return <FileCode className="w-3.5 h-3.5 text-[#FB923C]" />;
    }
    if (node.name.endsWith('.json')) {
      return <FileJson className="w-3.5 h-3.5 text-[#FFD400]" />;
    }
    return <FileText className="w-3.5 h-3.5 text-[#A3A3A3]" />;
  };

  const renderTree = (parentId: string | null, depth = 0) => {
    const children = Object.values(files)
      .filter((node) => node.parentId === parentId)
      .sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'folder' ? -1 : 1;
      });

    return children.map((node) => {
      const isFolder = node.type === 'folder';
      const isExpanded = Boolean(expandedFolders[node.id]);
      const isActive = node.id === activeFileId;

      return (
        <div key={node.id}>
          <div
            onClick={() => (isFolder ? toggleFolder(node.id) : selectFile(node.id))}
            style={{ paddingLeft: `${depth * 14 + 10}px` }}
            className={`group flex items-center justify-between py-1.5 pr-2 cursor-pointer text-xs font-mono transition-colors ${
              isActive
                ? 'bg-[#1f1d11] text-[#FFD400] border-l-2 border-[#FFD400]'
                : 'text-[#A3A3A3] hover:bg-[#151515] hover:text-[#F5F5F5]'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              {isFolder ? (
                <>
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-[#A3A3A3]" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-[#A3A3A3]" />
                  )}
                  {isExpanded ? (
                    <FolderOpen className="w-3.5 h-3.5 text-[#F5F5F5]" />
                  ) : (
                    <Folder className="w-3.5 h-3.5 text-[#A3A3A3]" />
                  )}
                  <span className="text-[#F5F5F5] font-medium">{node.name}/</span>
                </>
              ) : (
                <>
                  {renderFileIcon(node)}
                  <span className="truncate">{node.name}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {node.isDirty && (
                <span
                  title="Unsaved changes"
                  className="w-2 h-2 rounded-full bg-[#FFD400]"
                />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNode(node.id);
                }}
                title="Delete"
                className="opacity-0 group-hover:opacity-100 text-[#A3A3A3] hover:text-[#FF4D4F] transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {isFolder && isExpanded && renderTree(node.id, depth + 1)}
        </div>
      );
    });
  };

  return (
    <aside className="h-full bg-[#111111] border-r border-[#292929] flex flex-col justify-between select-none font-mono">
      <div>
        {/* Explorer Header */}
        <div className="h-9 px-3 border-b border-[#292929] flex items-center justify-between text-[11px] tracking-wider text-[#A3A3A3]">
          <span className="font-semibold">WORKSPACE</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCreatingType('file')}
              title="New File"
              className="p-1 hover:bg-[#1f1f1f] hover:text-[#F5F5F5] rounded-sm"
            >
              <FilePlus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCreatingType('folder')}
              title="New Folder"
              className="p-1 hover:bg-[#1f1f1f] hover:text-[#F5F5F5] rounded-sm"
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Inline Creation Input */}
        {creatingType && (
          <form onSubmit={handleCreateSubmit} className="p-2 border-b border-[#292929]">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={() => setCreatingType(null)}
              placeholder={`New ${creatingType} name...`}
              className="w-full bg-[#090909] border border-[#FFD400] px-2 py-1 text-xs text-[#F5F5F5] focus:outline-none"
            />
          </form>
        )}

        {/* File Tree */}
        <div className="py-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {renderTree(null)}
        </div>
      </div>

      {/* Bottom Telemetry Footer matching Reference Image */}
      <div className="border-t border-[#292929] bg-[#0d0d0d] p-2.5 text-[11px] space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[#A3A3A3]">COMPILER OPTIONS</span>
          <span className="text-[#FFD400] font-bold">ESNEXT</span>
        </div>
        <div className="flex items-center justify-between text-[#A3A3A3]">
          <span>RAM: CHROMIUM</span>
          <span>28.4 MB</span>
        </div>
        <div className="w-full h-1 bg-[#1f1f1f] rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-[#FFD400]" />
        </div>
      </div>
    </aside>
  );
};