import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum([
    "development",
    "test",
    "production"
  ]),
  PORT: z.coerce.number(),
  FRONTEND_URL: z.url(),
  DATABASE_URL: z.url(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number()
});

export type Env = z.infer<typeof envSchema>
