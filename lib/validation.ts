import { z } from 'zod';

export const eventSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Name is required'),
  kind: z.enum(['Ceremony', 'Reception', 'Other']),
  startAt: z.date({ required_error: 'Start date/time is required' }).nullable(),
  venue: z.string().min(1, 'Venue is required'),
  mapUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  dressCode: z.string().optional(),
  notes: z.string().optional(),
  rsvpRequired: z.boolean(),
  capacity: z
    .number({ invalid_type_error: 'Capacity must be a number' })
    .int('Capacity must be an integer')
    .positive('Capacity must be positive')
    .nullable()
    .optional(),
});

export type EventFormValues = z.infer<typeof eventSchema>;

export const rsvpSchema = z.object({
  id: z.string().min(1),
  guestName: z.string().min(1, 'Guest name is required'),
  eventId: z.string().min(1, 'Event is required'),
  status: z.enum(['Pending', 'Going', 'Not Going', 'Maybe']),
  mealChoice: z
    .enum(['None', 'Chicken', 'Beef', 'Fish', 'Vegan', 'Vegetarian', 'Kids'])
    .optional()
    .or(z.literal('')),
  plusOne: z.boolean(),
  notes: z.string().optional(),
});

export type RsvpFormValues = z.infer<typeof rsvpSchema>;
