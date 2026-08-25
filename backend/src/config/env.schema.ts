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
  LOGIN_USER_RATE_LIMIT_WINDOW: z.coerce.number(),
  LOGIN_USER_RATE_LIMIT_MAX: z.coerce.number(),
  REGISTER_USER_RATE_LIMIT_WINDOW: z.coerce.number(),
  REGISTER_USER_RATE_LIMIT_MAX: z.coerce.number(),
  FORGOT_PASSWORD_RATE_LIMIT_WINDOW: z.coerce.number(),
  FORGOT_PASSWORD_RATE_LIMIT_MAX: z.coerce.number(),
  RESET_PASSWORD_RATE_LIMIT_WINDOW: z.coerce.number(),
  RESET_PASSWORD_RATE_LIMIT_MAX: z.coerce.number(),
  REFRESH_TOKEN_RATE_LIMIT_WINDOW: z.coerce.number(),
  REFRESH_TOKEN_RATE_LIMIT_MAX: z.coerce.number(),
  VERIFY_EMAIL_RATE_LIMIT_WINDOW: z.coerce.number(),
  VERIFY_EMAIL_RATE_LIMIT_MAX: z.coerce.number(),
  SALT_ROUNDS: z.coerce.number(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_EXPIRES_IN: z.coerce.number(),
  JWT_REFRESH_EXPIRES_IN: z.coerce.number(),
  JWT_ISSUER: z.string(),
  JWT_AUDIENCE: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(),
  SMTP_FROM: z.string(),
  EMAIL_VERIFICATION_URL: z.url(),
  RESET_PASSWORD_TOKEN_EXPIRY: z.coerce.number()
});

export type Env = z.infer<typeof envSchema>
