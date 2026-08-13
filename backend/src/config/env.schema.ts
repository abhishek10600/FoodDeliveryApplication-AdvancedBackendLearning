import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum([
    "development",
    "test",
    "production"
  ]),
  PORT: z.coerce.number(),
  APP_NAME: z.string(),
  FRONTEND_URL: z.url(),
  DATABASE_URL: z.url(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
  CACHE_PREFIX: z.string(),
  CACHE_VERSION: z.string(),
  TRUST_PROXY: z.coerce.string(),
  REQUEST_TIMEOUT: z.string(),
  GLOBAL_RATE_LIMIT_WINDOW: z.coerce.number(),
  GLOBAL_RATE_LIMIT_MAX: z.coerce.number(),
  SALT_ROUNDS: z.coerce.number(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_EXPIRES_IN: z.coerce.number(),
  JWT_REFRESH_EXPIRES_IN: z.coerce.number(),
  JWT_ISSUER: z.string(),
  JWT_AUDIENCE: z.string()
});

export type Env = z.infer<typeof envSchema>
