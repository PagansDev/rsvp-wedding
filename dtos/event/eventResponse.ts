import { z } from 'zod';

export const eventResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  event_date: z.string(),
  invite_text: z.string().nullable(),
  message: z.string().nullable(),
  adress_1: z.string().nullable(),
  adress_2: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
});

export type EventResponse = z.infer<typeof eventResponseSchema>;
