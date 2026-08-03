import { injectable, inject } from "tsyringe";
import { InfrastructureTokens } from "../container/index.js";
import { CacheOperation } from "./cache.enum.js";
import { CacheMetrics } from "./cache.metrics.js";
import { cacheSerializer } from "./cache.serailizer.js";
import type { Redis } from "ioredis";
import type { ILogger } from "../../shared/logger/logger.interface.js";

@injectable()
export class CacheService {

  constructor(

    @inject(InfrastructureTokens.RedisClient)
    private readonly redis: Redis,

    @inject(InfrastructureTokens.Logger)
    private readonly logger: ILogger,

    private readonly cacheMetrics: CacheMetrics

  ) { }

  async get<T>(key: string): Promise<T | null> {

     const started = performance.now()

    try {
      const value = await this.redis.get(key);

      if (!value) {
        this.cacheMetrics.recordMiss(key)
        return null
      }

      this.cacheMetrics.recordHit(key)

      return cacheSerializer.deserialize<T>(value)

    } catch (error) {

      this.cacheMetrics.recordFailure(CacheOperation.GET, key, error)

      this.logger.error("Failed to get value from cache", {
        error,
        key
      })

      return null;
    }finally {
      this.cacheMetrics.recordLatency(CacheOperation.GET, key, performance.now() - started)
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

      this.cacheMetrics.recordSet(key)

    } catch (error) {

      this.cacheMetrics.recordFailure(CacheOperation.SET, key, error)

      this.logger.error("Failed to set value in cache", {
        error,
        key
      }
      )
    } finally {
      this.cacheMetrics.recordLatency(CacheOperation.SET, key, performance.now() - started)
    }
  }

  async delete(key: string): Promise<void> {

    const started = performance.now()

    try {
      await this.redis.del(key)

      this.cacheMetrics.recordDelete(key)

    } catch (error) {

      this.cacheMetrics.recordFailure(CacheOperation.DELETE, key, error)

      this.logger.error("Failed to delete cache key", {
        error,
        key
      })
    } finally {
      this.cacheMetrics.recordLatency(CacheOperation.DELETE, key, performance.now() - started)
    }
  }

  async exists(key: string): Promise<boolean> {

    const started = performance.now()

    try {

      const exists = await this.redis.exists(key)

      this.cacheMetrics.recordExists(key)

      return exists === 1;
    } catch (error) {

      this.cacheMetrics.recordFailure(CacheOperation.EXISTS, key, error)

      this.logger.error("Failed to check cache key", {
        error,
        key
      })

      return false
    } finally {
      this.cacheMetrics.recordLatency(CacheOperation.EXISTS, key, performance.now() - started)
    }
  }

  async expire(key: string, ttlInSeconds: number): Promise<void> {

    const started = performance.now()

    try {
      await this.redis.expire(key, ttlInSeconds)

      this.cacheMetrics.recordExpire(key, ttlInSeconds)

    } catch (error) {

      this.cacheMetrics.recordFailure(CacheOperation.EXPIRE, key, error)

      this.logger.error( "Failed to update the cache key expiration", {
        error,
        key
      })
    } finally {
      this.cacheMetrics.recordLatency(CacheOperation.EXPIRE, key, performance.now() - started)
    }
  }

  async increament(key: string): Promise<number> {

    const started = performance.now()

    try {

      const increamentCache = await this.redis.incr(key)

      this.cacheMetrics.recordIncreament(key)

      return increamentCache
    } catch (error) {

      this.cacheMetrics.recordFailure(CacheOperation.INCREMENT, key, error)

      this.logger.error("Failed to increament cache key", {
        error,
        key
      })

      return 0;
    }finally {
      this.cacheMetrics.recordLatency(CacheOperation.INCREMENT, key, performance.now() - started)
    }
  }
}
