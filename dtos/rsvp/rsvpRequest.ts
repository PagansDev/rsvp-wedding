import { z } from 'zod';

const phoneNumberSchema = z
  .string()
  .min(10, {
    message: 'O número de WhatsApp é obrigatório',
  })
  .refine(
    (value: string) => {
      const cleaned = value.replace(/\D/g, '');
      return cleaned.length === 11;
    },
    {
      message: 'Número de telefone inválido',
    }
  );

export const rsvpRequestSchema = z.object({

  name: z.string()
    .min(3, {
      message: 'O nome é obrigatório',
    }),
  hasGuest: z.boolean(),

  guestName: z.string().optional().nullable(),

  whatsapp: phoneNumberSchema,
})

export type RsvpRequest = z.infer<typeof rsvpRequestSchema>;
