"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SiteBuilderState, SiteSection, SiteTheme, HistoryState } from '@/types/site-builder';
import { generateId } from '@/lib/id';

const defaultTheme: SiteTheme = {
  colors: {
    primary: '#7C3AED',
    secondary: '#06B6D4',
    background: '#FFFFFF',
    surface: '#F9FAFB',
  },
  typography: {
    display: 1.2,
    h1: 1.1,
    h2: 1.0,
    h3: 0.9,
    h4: 0.8,
    h5: 0.7,
    h6: 0.6,
    body: 1.0,
    label: 0.8,
  },
};

const defaultState: SiteBuilderState = {
  sections: [],
  theme: defaultTheme,
  selectedSectionId: null,
  devicePreset: 'desktop',
  lastSaved: null,
};

interface SiteBuilderStore extends SiteBuilderState {
  history: HistoryState;
  
  // Section actions
  addSection: (kind: string, data?: Record<string, any>) => void;
  updateSection: (id: string, updates: Partial<SiteSection>) => void;
  deleteSection: (id: string) => void;
  duplicateSection: (id: string) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  selectSection: (id: string | null) => void;
  toggleSectionVisibility: (id: string) => void;
  renameSection: (id: string, name: string) => void;
  
  // Theme actions
  updateTheme: (updates: Partial<SiteTheme>) => void;
  
  // Device preset
  setDevicePreset: (preset: 'desktop' | 'tablet' | 'mobile') => void;
  
  // History actions
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Persistence
  save: () => void;
  reset: () => void;
  
  // Internal
  _setState: (state: SiteBuilderState) => void;
}

export const useSiteBuilderStore = create<SiteBuilderStore>()(
  persist(
    (set, get) => ({
      ...defaultState,
      history: {
        past: [],
        future: [],
        present: defaultState,
      },

      addSection: (kind, data = {}) => {
        const state = get();
        const newSection: SiteSection = {
          id: generateId(),
          kind: kind as any,
          name: `${kind.charAt(0).toUpperCase() + kind.slice(1)} Section`,
          visible: true,
          data,
          order: state.sections.length,
        };
        
        get().pushHistory();
        set((state) => ({
          sections: [...state.sections, newSection],
          selectedSectionId: newSection.id,
        }));
      },

      updateSection: (id, updates) => {
        get().pushHistory();
        set((state) => ({
          sections: state.sections.map((section) =>
            section.id === id ? { ...section, ...updates } : section
          ),
        }));
      },

      deleteSection: (id) => {
        get().pushHistory();
        set((state) => ({
          sections: state.sections.filter((section) => section.id !== id),
          selectedSectionId: state.selectedSectionId === id ? null : state.selectedSectionId,
        }));
      },

      duplicateSection: (id) => {
        const state = get();
        const section = state.sections.find((s) => s.id === id);
        if (!section) return;

        get().pushHistory();
        const newSection: SiteSection = {
          ...section,
          id: generateId(),
          name: `${section.name} (Copy)`,
          order: section.order + 1,
        };

        set((state) => ({
          sections: [
            ...state.sections.slice(0, section.order + 1),
            newSection,
            ...state.sections.slice(section.order + 1).map((s) => ({ ...s, order: s.order + 1 })),
          ],
          selectedSectionId: newSection.id,
        }));
      },

      reorderSections: (fromIndex, toIndex) => {
        get().pushHistory();
        set((state) => {
          const newSections = [...state.sections];
          const [movedSection] = newSections.splice(fromIndex, 1);
          newSections.splice(toIndex, 0, movedSection);
          
          return {
            sections: newSections.map((section, index) => ({ ...section, order: index })),
          };
        });
      },

      selectSection: (id) => {
        set({ selectedSectionId: id });
      },

      toggleSectionVisibility: (id) => {
        get().pushHistory();
        set((state) => ({
          sections: state.sections.map((section) =>
            section.id === id ? { ...section, visible: !section.visible } : section
          ),
        }));
      },

      renameSection: (id, name) => {
        get().pushHistory();
        set((state) => ({
          sections: state.sections.map((section) =>
            section.id === id ? { ...section, name } : section
          ),
        }));
      },

      updateTheme: (updates) => {
        get().pushHistory();
        set((state) => ({
          theme: {
            ...state.theme,
            ...updates,
            colors: { ...state.theme.colors, ...updates.colors },
            typography: { ...state.theme.typography, ...updates.typography },
          },
        }));
      },

      setDevicePreset: (preset) => {
        set({ devicePreset: preset });
      },

      pushHistory: () => {
        const state = get();
        const currentState = {
          sections: state.sections,
          theme: state.theme,
          selectedSectionId: state.selectedSectionId,
          devicePreset: state.devicePreset,
          lastSaved: state.lastSaved,
        };

        set((state) => ({
          history: {
            past: [...state.history.past, state.history.present],
            future: [],
            present: currentState,
          },
        }));
      },

      undo: () => {
        const state = get();
        if (state.history.past.length === 0) return;

        const previous = state.history.past[state.history.past.length - 1];
        set((state) => ({
          ...previous,
          history: {
            past: state.history.past.slice(0, -1),
            future: [state.history.present, ...state.history.future],
            present: previous,
          },
        }));
      },

      redo: () => {
        const state = get();
        if (state.history.future.length === 0) return;

        const next = state.history.future[0];
        set((state) => ({
          ...next,
          history: {
            past: [...state.history.past, state.history.present],
            future: state.history.future.slice(1),
            present: next,
          },
        }));
      },

      canUndo: () => {
        return get().history.past.length > 0;
      },

      canRedo: () => {
        return get().history.future.length > 0;
      },

      save: () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
        
        set({ lastSaved: timeString });
      },

      reset: () => {
        get().pushHistory();
        set({
          ...defaultState,
          history: {
            past: [...get().history.past, get().history.present],
            future: [],
            present: defaultState,
          },
        });
      },

      _setState: (newState) => {
        set(newState);
      },
    }),
    {
      name: 'amora.sitebuilder.v1',
      partialize: (state) => ({
        sections: state.sections,
        theme: state.theme,
        selectedSectionId: state.selectedSectionId,
        devicePreset: state.devicePreset,
        lastSaved: state.lastSaved,
      }),
    }
  )
);