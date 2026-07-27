import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z.coerce.number(),
});

export type Env = z.infer<typeof envSchema>
