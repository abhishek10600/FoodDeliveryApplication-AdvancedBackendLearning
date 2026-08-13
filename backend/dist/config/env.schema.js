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
    GLOBAL_RATE_LIMIT_MAX: z.coerce.number()
});
