"use client";

import { create } from 'zustand';
import type { RSVP, RSVPStatus } from '@/types/rsvp';

export type RsvpsFilter = {
  query: string;
  eventId: 'All' | string;
  status: 'All' | RSVPStatus;
};

type RsvpsState = {
  rsvps: RSVP[];
  filter: RsvpsFilter;
  addRsvp: (r: RSVP) => void;
  updateRsvp: (r: RSVP) => void;
  deleteRsvp: (id: string) => void;
  setFilter: (f: Partial<RsvpsFilter>) => void;
  clearAll: () => void;
};

export const useRsvpsStore = create<RsvpsState>((set) => ({
  rsvps: [],
  filter: { query: '', eventId: 'All', status: 'All' },
  addRsvp: (r) => set((s) => ({ rsvps: [...s.rsvps, r] })),
  updateRsvp: (r) => set((s) => ({ rsvps: s.rsvps.map((x) => (x.id === r.id ? { ...x, ...r } : x)) })),
  deleteRsvp: (id) => set((s) => ({ rsvps: s.rsvps.filter((x) => x.id !== id) })),
  setFilter: (f) => set((s) => ({ filter: { ...s.filter, ...f } })),
  clearAll: () => set({ rsvps: [] }),
}));
