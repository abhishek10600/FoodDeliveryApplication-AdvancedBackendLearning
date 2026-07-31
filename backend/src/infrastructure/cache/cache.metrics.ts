import { logger } from "../../config/logger.js";

export class CacheMetrics {
  recordHit(key: string): void {
    logger.debug({key}, "Cache hit")
  }

  recordMiss(key: string): void {
    logger.debug({key}, "Cache miss")
  }

  recordSet(key: string): void {
    logger.debug({key}, "Cache set")
  }

  recordDelete(key: string): void {
    logger.debug({ key }, "Cache delete");
  }

  recordExists(key: string): void {
    logger.debug({key}, "Cache exists check")
  }

  recordExpire(key: string, ttlInSeconds: number): void {
    logger.debug({key, ttlInSeconds}, "Cache expiry set")
  }

  recordIncreament(key: string): void {
    logger.debug({key}, "Cache increamented")
  }

  recordFailure(operation: string, key: string, error: unknown): void {
    logger.warn({
      operation,
      key,
      error
    },
      "Cache operation failed"
    )
  }

  recordLatency(operation: string, key: string, durationMs: number): void {
    logger.debug({
      operation,
      key,
      durationMs
    },
      "Cache latency"
    )
  }
}

export const cacheMetrics = new CacheMetrics();
