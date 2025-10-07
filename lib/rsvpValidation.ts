import { z } from 'zod';

export const rsvpSchema = z.object({
  id: z.string().min(1),
  guestName: z.string().min(1, 'Guest name is required'),
  eventName: z.string().min(1, 'Event is required'),
  status: z.enum(['Pending', 'Accepted', 'Declined', 'Maybe']),
  mealChoice: z.string().optional(),
  plusOne: z.boolean().default(false),
  notes: z.string().optional(),
});

export type RsvpFormValues = z.infer<typeof rsvpSchema>;
