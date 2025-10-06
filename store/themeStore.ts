"use client";

import { create } from 'zustand';

type ThemeState = {
  mode: 'light' | 'dark';
  primaryColor: string;
  toggleMode: () => void;
  setPrimaryColor: (color: string) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'light',
  primaryColor: '#7C3AED',
  toggleMode: () => set((s) => ({ mode: s.mode === 'light' ? 'dark' : 'light' })),
  setPrimaryColor: (color) => set({ primaryColor: color }),
}));
