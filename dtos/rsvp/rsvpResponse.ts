import { z } from 'zod';

export const rsvpResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  has_guest: z.boolean(),
  guest_name: z.string().nullable(),
  whatsapp: z.string(),
  document: z.string(),
  guest_document: z.string().nullable(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
});

export type RsvpResponse = z.infer<typeof rsvpResponseSchema>;
