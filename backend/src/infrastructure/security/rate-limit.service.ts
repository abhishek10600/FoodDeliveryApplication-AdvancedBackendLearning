import { injectable, inject } from "tsyringe";
import { RedisStore, type RedisReply } from "rate-limit-redis"
import { InfrastructureTokens } from "../container/index.js";
import { Redis } from "ioredis";
import { IRateLimitPolicy } from "../../shared/types/RateLimitPolicy.interface.js";
import { rateLimit, ipKeyGenerator, type RateLimitRequestHandler } from "express-rate-limit";

@injectable()
export class RateLimitService {

  constructor(

    @inject(InfrastructureTokens.RedisClient)
    private readonly redis: Redis

  ) {}

  createLimiter(policy: IRateLimitPolicy, prefix: string): RateLimitRequestHandler {

    const redisStore = new RedisStore({
      prefix: `rate-limit:${prefix}:`,
      sendCommand: (
        command: string,
        ...args: string[]
      ) => this.redis.call(command, ...args) as Promise<RedisReply>
    })

    return rateLimit({
      windowMs: policy.windowMs,
      max: policy.max,
      standardHeaders: true,
      legacyHeaders: false,
      store: redisStore,
      skipSuccessfulRequests: true,
      keyGenerator: (req) => {
        return ipKeyGenerator(req.ip ?? "unknown")
      },
      identifier: prefix,
      message: {
        success: false,
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: "Too many requests. Please try again later."
        }
      }
    })
  }
}
