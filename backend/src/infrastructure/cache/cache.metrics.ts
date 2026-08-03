import { inject, injectable } from "tsyringe";
import { InfrastructureTokens } from "../container/index.js";
import type  { ILogger } from "../../shared/logger/logger.interface.js";

@injectable()
export class CacheMetrics {

  constructor(

    @inject(InfrastructureTokens.Logger)
    private readonly logger: ILogger
  ) { }

  recordHit(key: string): void {
    this.logger.debug("Cache hit", {key})
  }

  recordMiss(key: string): void {
    this.logger.debug("Cache miss", {key})
  }

  recordSet(key: string): void {
    this.logger.debug("Cache set", {key})
  }

  recordDelete(key: string): void {
    this.logger.debug("Cache delete", { key });
  }

  recordExists(key: string): void {
    this.logger.debug("Cache exists check", {key})
  }

  recordExpire(key: string, ttlInSeconds: number): void {
    this.logger.debug( "Cache expiry set", {key, ttlInSeconds})
  }

  recordIncreament(key: string): void {
    this.logger.debug("Cache increamented", {key})
  }

  recordFailure(operation: string, key: string, error: unknown): void {
    this.logger.warn("Cache operation failed", {
      operation,
      key,
      error
    })
  }

  recordLatency(operation: string, key: string, durationMs: number): void {
    this.logger.debug("Cache latency", {
      operation,
      key,
      durationMs
    })
  }
}
