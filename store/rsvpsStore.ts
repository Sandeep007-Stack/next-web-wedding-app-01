"use client";

import { create } from 'zustand';
import { RsvpItem, RsvpStatus } from '@/types/rsvp';

export type RsvpFilter = {
  query: string;
  status: 'All' | RsvpStatus;
};

type RsvpsState = {
  rsvps: RsvpItem[];
  filter: RsvpFilter;
  add: (r: RsvpItem) => void;
  update: (r: RsvpItem) => void;
  remove: (id: string) => void;
  setFilter: (f: Partial<RsvpFilter>) => void;
  clearAll: () => void;
};

export const useRsvpsStore = create<RsvpsState>((set) => ({
  rsvps: [],
  filter: { query: '', status: 'All' },
  add: (r) => set((s) => ({ rsvps: [...s.rsvps, r] })),
  update: (r) => set((s) => ({ rsvps: s.rsvps.map((x) => (x.id === r.id ? { ...x, ...r } : x)) })),
  remove: (id) => set((s) => ({ rsvps: s.rsvps.filter((x) => x.id !== id) })),
  setFilter: (f) => set((s) => ({ filter: { ...s.filter, ...f } })),
  clearAll: () => set({ rsvps: [] }),
}));
