"use client";

import { useEffect } from 'react';
import { useSiteBuilderStore } from '@/store/siteBuilderStore';

export function KeyboardShortcuts() {
  const { undo, redo, canUndo, canRedo } = useSiteBuilderStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if Ctrl (Windows/Linux) or Cmd (Mac) is pressed
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;
      
      if (!isCtrlOrCmd) return;

      // Undo: Ctrl/Cmd + Z
      if (event.key === 'z' && !event.shiftKey) {
        if (canUndo()) {
          event.preventDefault();
          undo();
        }
        return;
      }

      // Redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
      if ((event.key === 'z' && event.shiftKey) || event.key === 'y') {
        if (canRedo()) {
          event.preventDefault();
          redo();
        }
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  return null;
}