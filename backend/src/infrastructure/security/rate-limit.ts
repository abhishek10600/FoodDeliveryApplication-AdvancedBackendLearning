import rateLimit, { type RateLimitRequestHandler} from "express-rate-limit"
import { env } from "../../config/env.config.js"

const baseOptions = {
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false
  } as const

export const globalRateLimiter: RateLimitRequestHandler = rateLimit({
  ...baseOptions,
  windowMs: env.GLOBAL_RATE_LIMIT_WINDOW * 60 * 1000,
  max: env.GLOBAL_RATE_LIMIT_MAX,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEED",
      message: "Too many requests. Please try again later"
    }
  }
})
