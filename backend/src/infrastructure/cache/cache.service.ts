import { injectable, inject } from "tsyringe";
import { InfrastructureTokens } from "../container/index.js";
import { CacheOperation } from "./cache.enum.js";
import { cacheMetrics } from "./cache.metrics.js";
import { cacheSerializer } from "./cache.serailizer.js";
import type { Redis } from "ioredis";
import type { Logger } from "pino";

@injectable()
export class CacheService {

  constructor(

    @inject(InfrastructureTokens.RedisClient)
    private readonly redis: Redis,

    @inject(InfrastructureTokens.Logger)
    private readonly logger: Logger

  ) { }

  async get<T>(key: string): Promise<T | null> {

     const started = performance.now()

    try {
      const value = await this.redis.get(key);

      if (!value) {
        cacheMetrics.recordMiss(key)
        return null
      }

      cacheMetrics.recordHit(key)

      return cacheSerializer.deserialize<T>(value)

    } catch (error) {

      cacheMetrics.recordFailure(CacheOperation.GET, key, error)

      this.logger.error({
        error,
        key
      }, "Failed to get value from cache")

      return null;
    }finally {
      cacheMetrics.recordLatency(CacheOperation.GET, key, performance.now() - started)
    }
  }

  async set<T>(key: string, value: T, ttlInSeconds?: number): Promise<void> {

    const started = performance.now()

    try {
      const serialized = cacheSerializer.serialize(value)

      if (ttlInSeconds) {
        await this.redis.set(key, serialized, "EX", ttlInSeconds)
      } else {
        await this.redis.set(key, serialized)
      }

      cacheMetrics.recordSet(key)

    } catch (error) {

      cacheMetrics.recordFailure(CacheOperation.SET, key, error)

      this.logger.error({
        error,
        key
      },
        "Failed to set value in cache"
      )
    } finally {
      cacheMetrics.recordLatency(CacheOperation.SET, key, performance.now() - started)
    }
  }

  async delete(key: string): Promise<void> {

    const started = performance.now()

    try {
      await this.redis.del(key)

      cacheMetrics.recordDelete(key)

    } catch (error) {

      cacheMetrics.recordFailure(CacheOperation.DELETE, key, error)

      this.logger.error({
        error,
        key
      }, "Failed to delete cache key")
    } finally {
      cacheMetrics.recordLatency(CacheOperation.DELETE, key, performance.now() - started)
    }
  }

  async exists(key: string): Promise<boolean> {

    const started = performance.now()

    try {

      const exists = await this.redis.exists(key)

      cacheMetrics.recordExists(key)

      return exists === 1;
    } catch (error) {

      cacheMetrics.recordFailure(CacheOperation.EXISTS, key, error)

      this.logger.error({
        error,
        key
      }, "Failed to check cache key")

      return false
    } finally {
      cacheMetrics.recordLatency(CacheOperation.EXISTS, key, performance.now() - started)
    }
  }

  async expire(key: string, ttlInSeconds: number): Promise<void> {

    const started = performance.now()

    try {
      await this.redis.expire(key, ttlInSeconds)

      cacheMetrics.recordExpire(key, ttlInSeconds)

    } catch (error) {

      cacheMetrics.recordFailure(CacheOperation.EXPIRE, key, error)

      this.logger.error({
        error,
        key
      }, "Failed to update the cache key expiration")
    } finally {
      cacheMetrics.recordLatency(CacheOperation.EXPIRE, key, performance.now() - started)
    }
  }

  async increament(key: string): Promise<number> {

    const started = performance.now()

    try {

      const increamentCache = await this.redis.incr(key)

      cacheMetrics.recordIncreament(key)

      return increamentCache
    } catch (error) {

      cacheMetrics.recordFailure(CacheOperation.INCREMENT, key, error)

      this.logger.error({
        error,
        key
      }, "Failed to increament cache key")

      return 0;
    }finally {
      cacheMetrics.recordLatency(CacheOperation.INCREMENT, key, performance.now() - started)
    }
  }
}
