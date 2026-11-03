import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),

  ACCESS_TOKEN_SECRET: z.string().min(1),
  ACCESS_TOKEN_TTL: z.coerce.number().int().positive(),

  REFRESH_TOKEN_SECRET: z.string().min(1),
  REFRESH_TOKEN_TTL: z.coerce.number().int().positive()
})

export const env = envSchema.parse(process.env)