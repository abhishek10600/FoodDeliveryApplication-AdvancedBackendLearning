import { injectable, inject } from "tsyringe";
import { RedisStore, type RedisReply } from "rate-limit-redis"
import { InfrastructureTokens } from "../container/index.js";
import { Redis } from "ioredis";
import { IRateLimitPolicy } from "../../shared/types/RateLimitPolicy.interface.js";
import { rateLimit, type RateLimitRequestHandler } from "express-rate-limit";

@injectable()
export class RateLimitService {

  private readonly redisStore: RedisStore

  constructor(

    @inject(InfrastructureTokens.RedisClient)
    private readonly redis: Redis

  ) {
    this.redisStore = new RedisStore({
      sendCommand: (command: string,...args: string[]) => this.redis.call(command, ...args) as Promise<RedisReply>
    })
  }

  createLimiter(policy: IRateLimitPolicy, prefix: string): RateLimitRequestHandler {
    return rateLimit({
      windowMs: policy.windowMs,
      max: policy.max,
      standardHeaders: true,
      legacyHeaders: false,
      store: this.redisStore,
      skipSuccessfulRequests: true,
      keyGenerator: (req) => {
        return req.ip ?? "unknown"
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
