"use client";

import { create } from 'zustand';
import { AmoraEvent } from '@/types/events';

export type EventsFilter = {
  query: string;
  kind: 'All' | 'Ceremony' | 'Reception' | 'Other';
};

type EventsState = {
  events: AmoraEvent[];
  filter: EventsFilter;
  addEvent: (e: AmoraEvent) => void;
  updateEvent: (e: AmoraEvent) => void;
  deleteEvent: (id: string) => void;
  setFilter: (f: Partial<EventsFilter>) => void;
  clearAll: () => void;
};

export const useEventsStore = create<EventsState>((set) => ({
  events: [],
  filter: { query: '', kind: 'All' },
  addEvent: (e) => set((s) => ({ events: [...s.events, e] })),
  updateEvent: (e) =>
    set((s) => ({ events: s.events.map((x) => (x.id === e.id ? { ...x, ...e } : x)) })),
  deleteEvent: (id) => set((s) => ({ events: s.events.filter((x) => x.id !== id) })),
  setFilter: (f) => set((s) => ({ filter: { ...s.filter, ...f } })),
  clearAll: () => set({ events: [] }),
}));
