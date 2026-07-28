import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum([
    "development",
    "test",
    "production"
  ]),
  PORT: z.coerce.number(),
  FRONTEND_URL: z.url()
});

export type Env = z.infer<typeof envSchema>
