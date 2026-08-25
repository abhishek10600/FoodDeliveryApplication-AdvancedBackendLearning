import rateLimit, { type RateLimitRequestHandler} from "express-rate-limit"
import { RateLimitPolicies } from "../../config/rate-limit.config.js"

const baseOptions = {
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false
  } as const

export const globalRateLimiter: RateLimitRequestHandler = rateLimit({
  ...baseOptions,
  windowMs: RateLimitPolicies.Global.windowMs,
  max: RateLimitPolicies.Global.max,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEED",
      message: "Too many requests. Please try again later"
    }
  }
})
