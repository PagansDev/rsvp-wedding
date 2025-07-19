import { z } from 'zod';

export const eventRequestSchema = z.object({
  name: z.string().min(1, 'Nome do evento é obrigatório'),
  event_date: z.string().min(1, 'Data do evento é obrigatória'),
  invite_text: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
  adress_1: z.string().nullable().optional(),
  adress_2: z.string().nullable().optional(),
});

export type EventRequest = z.infer<typeof eventRequestSchema>;
