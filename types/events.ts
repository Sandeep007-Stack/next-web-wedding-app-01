export type EventKind = 'Ceremony' | 'Reception' | 'Other';

export interface AmoraEvent {
  id: string;
  name: string;
  kind: EventKind;
  startAt: Date | null;
  venue: string;
  mapUrl?: string;
  dressCode?: string;
  notes?: string;
  rsvpRequired: boolean;
  capacity?: number | null;
}
