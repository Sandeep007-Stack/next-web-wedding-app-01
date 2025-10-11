export type GuestTag = 'VIP' | 'Family' | 'Friends';

export interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  tags: GuestTag[];
}

export const GUEST_TAGS: GuestTag[] = ['VIP', 'Family', 'Friends'];
