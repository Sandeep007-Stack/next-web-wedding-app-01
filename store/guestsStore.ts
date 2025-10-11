"use client";

import { create } from 'zustand';
import type { Guest } from '@/types/guests';

type GuestsState = {
  guests: Guest[];
  addGuests: (list: Guest[]) => void;
  updateGuest: (g: Guest) => void;
  deleteGuests: (ids: string[]) => void;
  clearAll: () => void;
};

export const useGuestsStore = create<GuestsState>((set) => ({
  guests: [],
  addGuests: (list) => set((s) => ({ guests: [...s.guests, ...list] })),
  updateGuest: (g) => set((s) => ({ guests: s.guests.map((x) => (x.id === g.id ? { ...x, ...g } : x)) })),
  deleteGuests: (ids) => set((s) => ({ guests: s.guests.filter((x) => !ids.includes(x.id)) })),
  clearAll: () => set({ guests: [] }),
}));
