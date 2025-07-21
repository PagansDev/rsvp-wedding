import { z } from 'zod';

export const giftRequestSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  external_reference: z.string().optional().nullable(),
  price: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  payment_url: z.string().optional().nullable(),
  quantity: z
    .number()
    .min(1, { message: 'Quantidade deve ser maior que 0' })
    .default(1),
  quantity_gifted: z
    .number()
    .min(0, { message: 'Quantidade presenteada não pode ser negativa' })
    .default(0),
  is_available: z.boolean().default(true),
});

export type GiftRequest = z.infer<typeof giftRequestSchema>;
