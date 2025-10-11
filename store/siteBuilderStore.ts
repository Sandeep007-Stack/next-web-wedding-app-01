"use client";

import { create } from 'zustand';
import { subscribeWithSelector, persist } from 'zustand/middleware';
import { 
  SiteSection, 
  SiteTheme, 
  SiteBuilderState, 
  SiteBuilderSnapshot, 
  DevicePreset,
  defaultTheme,
  SectionKind,
  defaultSectionData
} from '@/types/site-builder';
import { generateId } from '@/lib/id';

interface SiteBuilderActions {
  // Section management
  addSection: (kind: SectionKind, name?: string) => void;
  removeSection: (id: string) => void;
  duplicateSection: (id: string) => void;
  updateSection: (id: string, updates: Partial<SiteSection>) => void;
  updateSectionData: (id: string, data: Record<string, any>) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  toggleSectionVisibility: (id: string) => void;
  renameSection: (id: string, name: string) => void;
  
  // Selection
  selectSection: (id: string | null) => void;
  
  // Theme
  updateTheme: (updates: Partial<SiteTheme>) => void;
  updateThemeColors: (colors: Partial<SiteTheme['colors']>) => void;
  updateThemeTypography: (typography: Partial<SiteTheme['typography']>) => void;
  
  // Device preset
  setDevicePreset: (preset: DevicePreset) => void;
  
  // History management
  pushToHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Persistence
  save: () => void;
  reset: () => void;
  clearAll: () => void;
}

type SiteBuilderStore = SiteBuilderState & SiteBuilderActions;

const createSnapshot = (state: SiteBuilderState): SiteBuilderSnapshot => ({
  sections: JSON.parse(JSON.stringify(state.sections)),
  theme: JSON.parse(JSON.stringify(state.theme)),
  timestamp: new Date(),
});

const initialState: SiteBuilderState = {
  sections: [],
  theme: defaultTheme,
  selectedSectionId: null,
  devicePreset: 'Desktop',
  history: {
    past: [],
    future: [],
  },
  lastSaved: null,
};

export const useSiteBuilderStore = create<SiteBuilderStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Section management
      addSection: (kind: SectionKind, name?: string) => {
        const newSection: SiteSection = {
          id: generateId(),
          kind,
          name: name || `${kind} Section`,
          visible: true,
          data: { ...defaultSectionData[kind] },
        };
        
        set((state) => {
          const newState = {
            ...state,
            sections: [...state.sections, newSection],
            selectedSectionId: newSection.id,
          };
          return newState;
        });
        get().pushToHistory();
      },
      
      removeSection: (id: string) => {
        set((state) => {
          const newState = {
            ...state,
            sections: state.sections.filter(s => s.id !== id),
            selectedSectionId: state.selectedSectionId === id ? null : state.selectedSectionId,
          };
          return newState;
        });
        get().pushToHistory();
      },
      
      duplicateSection: (id: string) => {
        const section = get().sections.find(s => s.id === id);
        if (!section) return;
        
        const duplicated: SiteSection = {
          ...section,
          id: generateId(),
          name: `${section.name} Copy`,
        };
        
        set((state) => {
          const index = state.sections.findIndex(s => s.id === id);
          const newSections = [...state.sections];
          newSections.splice(index + 1, 0, duplicated);
          
          return {
            ...state,
            sections: newSections,
            selectedSectionId: duplicated.id,
          };
        });
        get().pushToHistory();
      },
      
      updateSection: (id: string, updates: Partial<SiteSection>) => {
        set((state) => ({
          ...state,
          sections: state.sections.map(s => 
            s.id === id ? { ...s, ...updates } : s
          ),
        }));
      },
      
      updateSectionData: (id: string, data: Record<string, any>) => {
        set((state) => ({
          ...state,
          sections: state.sections.map(s => 
            s.id === id ? { ...s, data: { ...s.data, ...data } } : s
          ),
        }));
        // Debounce history push for data updates
        setTimeout(() => get().pushToHistory(), 300);
      },
      
      reorderSections: (fromIndex: number, toIndex: number) => {
        set((state) => {
          const newSections = [...state.sections];
          const [removed] = newSections.splice(fromIndex, 1);
          newSections.splice(toIndex, 0, removed);
          
          return {
            ...state,
            sections: newSections,
          };
        });
        get().pushToHistory();
      },
      
      toggleSectionVisibility: (id: string) => {
        set((state) => ({
          ...state,
          sections: state.sections.map(s => 
            s.id === id ? { ...s, visible: !s.visible } : s
          ),
        }));
        get().pushToHistory();
      },
      
      renameSection: (id: string, name: string) => {
        get().updateSection(id, { name });
        get().pushToHistory();
      },
      
      // Selection
      selectSection: (id: string | null) => {
        set((state) => ({
          ...state,
          selectedSectionId: id,
        }));
      },
      
      // Theme
      updateTheme: (updates: Partial<SiteTheme>) => {
        set((state) => ({
          ...state,
          theme: { ...state.theme, ...updates },
        }));
        // Debounce history push for theme updates
        setTimeout(() => get().pushToHistory(), 150);
      },
      
      updateThemeColors: (colors: Partial<SiteTheme['colors']>) => {
        set((state) => ({
          ...state,
          theme: {
            ...state.theme,
            colors: { ...state.theme.colors, ...colors },
          },
        }));
        setTimeout(() => get().pushToHistory(), 150);
      },
      
      updateThemeTypography: (typography: Partial<SiteTheme['typography']>) => {
        set((state) => ({
          ...state,
          theme: {
            ...state.theme,
            typography: { ...state.theme.typography, ...typography },
          },
        }));
        setTimeout(() => get().pushToHistory(), 150);
      },
      
      // Device preset
      setDevicePreset: (preset: DevicePreset) => {
        set((state) => ({
          ...state,
          devicePreset: preset,
        }));
      },
      
      // History management
      pushToHistory: () => {
        set((state) => {
          const snapshot = createSnapshot(state);
          const newPast = [...state.history.past, snapshot].slice(-50); // Keep last 50 states
          
          return {
            ...state,
            history: {
              past: newPast,
              future: [], // Clear future when new action is performed
            },
          };
        });
      },
      
      undo: () => {
        const state = get();
        if (state.history.past.length === 0) return;
        
        const previous = state.history.past[state.history.past.length - 1];
        const currentSnapshot = createSnapshot(state);
        
        set({
          ...state,
          sections: previous.sections,
          theme: previous.theme,
          history: {
            past: state.history.past.slice(0, -1),
            future: [currentSnapshot, ...state.history.future],
          },
        });
      },
      
      redo: () => {
        const state = get();
        if (state.history.future.length === 0) return;
        
        const next = state.history.future[0];
        const currentSnapshot = createSnapshot(state);
        
        set({
          ...state,
          sections: next.sections,
          theme: next.theme,
          history: {
            past: [...state.history.past, currentSnapshot],
            future: state.history.future.slice(1),
          },
        });
      },
      
      canUndo: () => get().history.past.length > 0,
      canRedo: () => get().history.future.length > 0,
      
      // Persistence
      save: () => {
        set((state) => ({
          ...state,
          lastSaved: new Date(),
        }));
      },
      
      reset: () => {
        set(initialState);
      },
      
      clearAll: () => {
        set({
          ...initialState,
          lastSaved: null,
        });
      },
    }),
    {
      name: 'amora.sitebuilder.v1',
      partialize: (state) => ({
        sections: state.sections,
        theme: state.theme,
        devicePreset: state.devicePreset,
        lastSaved: state.lastSaved,
      }),
    }
  )
);