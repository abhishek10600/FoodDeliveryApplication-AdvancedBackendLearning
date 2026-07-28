import { env } from "./env.config.js";

export const corsOptions = {
  origin: env.FRONTEND_URL,
  credentials: true
}
