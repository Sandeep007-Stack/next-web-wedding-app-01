export type RSVPStatus = 'Pending' | 'Going' | 'Not Going' | 'Maybe';

export type MealChoice =
  | 'None'
  | 'Chicken'
  | 'Beef'
  | 'Fish'
  | 'Vegan'
  | 'Vegetarian'
  | 'Kids';

export interface RSVP {
  id: string;
  guestName: string;
  eventId: string;
  status: RSVPStatus;
  mealChoice?: MealChoice | '';
  plusOne: boolean;
  notes?: string;
}

export const RSVP_STATUSES: RSVPStatus[] = ['Pending', 'Going', 'Not Going', 'Maybe'];
export const MEAL_CHOICES: MealChoice[] = ['None', 'Chicken', 'Beef', 'Fish', 'Vegan', 'Vegetarian', 'Kids'];
