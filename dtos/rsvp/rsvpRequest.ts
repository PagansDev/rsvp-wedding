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

// Schema RG (old: XX.XXX.XXX-X) and CIN (XX.XXX.XXX-X)
const documentSchema = z
  .string()
  .optional()
  .nullable()
  .refine(
    (value) => {
      if (!value) return true;
      const cleaned = value.replace(/\D/g, '');
      return cleaned.length === 9 || cleaned.length === 11;
    },
    {
      message: 'RG deve ter 9 dígitos ou CIN deve ter 11 dígitos',
    }
  );

export const rsvpRequestSchema = z.object({
  name: z.string().min(3, {
    message: 'O nome é obrigatório',
  }),
  hasGuest: z.boolean(),
  guestName: z.string().optional().nullable(),
  whatsapp: phoneNumberSchema,
  document: documentSchema,
  guestDocument: documentSchema,
});

export type RsvpRequest = z.infer<typeof rsvpRequestSchema>;
