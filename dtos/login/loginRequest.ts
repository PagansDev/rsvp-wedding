import { z } from 'zod'

export const loginRequestSchema = z.object({

    user: z.string()
      .min(3, {
        message: 'O usuário é obrigatório',
      }),
    password: z.string()
      .min(6, {
        message: 'A senha é obrigatória e deve conter pelo menos 6 caracteres',
      }),
  })

export type LoginRequest = z.infer<typeof loginRequestSchema>;