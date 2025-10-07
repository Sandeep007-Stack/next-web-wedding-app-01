export type RsvpStatus = 'Pending' | 'Accepted' | 'Declined' | 'Maybe';

export interface RsvpItem {
  id: string;
  guestName: string;
  eventName: string;
  status: RsvpStatus;
  mealChoice?: string;
  plusOne: boolean;
  notes?: string;
}
