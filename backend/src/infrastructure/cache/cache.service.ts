import { logger } from "../../config/logger.js";
import redis from "./redis.js";

export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key);

      if (!value) {
        return null
      }

      return JSON.parse(value) as T;

    } catch (error) {
      logger.error({
        error,
        key
      }, "Failed to get value from cache")

      return null;
    }
  }

  async set<T>(key: string, value: T, ttlInSeconds?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value)

      if (ttlInSeconds) {
        await redis.set(key, serialized, "EX", ttlInSeconds)
        return;
      }

      await redis.set(key, serialized)

    } catch (error) {
      logger.error({
        error,
        key
      },
        "Failed to set value in cache"
      )
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await redis.del(key)
    } catch (error) {
      logger.error({
        error,
        key
      }, "Failed to delete cache key")
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      return (await redis.exists(key) === 1)
    } catch (error) {
      logger.error({
        error,
        key
      }, "Failed to check cache key")

      return false
    }
  }

  async expire(key: string, ttlInSeconds: number): Promise<void> {
    try {
      await redis.expire(key, ttlInSeconds)
    } catch (error) {
      logger.error({
        error,
        key
      }, "Failed to update the cache key expiration")
    }
  }

  async increament(key: string): Promise<number> {
    try {
      return await redis.incr(key)
    } catch (error) {
      logger.error({
        error,
        key
      }, "Failed to increament cache key")

      return 0;
    }
  }
}

export const cacheService = new CacheService();
