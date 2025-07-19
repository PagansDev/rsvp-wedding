import { z } from 'zod';

export const adminGiftResponseSchema = z.object({
  id: z.number(),
  external_reference: z.string().nullable(),
  name: z.string(),
  is_available: z.boolean(),
  image_url: z.string().nullable(),
  price: z.string().nullable(),
  payment_url: z.string().nullable(),
  quantity: z.number(),
  quantity_gifted: z.number(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
});

export type AdminGiftResponse = z.infer<typeof adminGiftResponseSchema>;
export type GiftResponse = z.infer<typeof adminGiftResponseSchema>;
