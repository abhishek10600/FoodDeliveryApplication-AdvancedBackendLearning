import { injectable, inject } from "tsyringe";
import { InfrastructureTokens } from "../container/index.js";
import type { Redis } from "ioredis";
import type { ILogger } from "../../shared/logger/logger.interface.js";

@injectable()
export class RedisService {

  constructor(

    @inject(InfrastructureTokens.RedisClient)
    private readonly redis: Redis,

    @inject(InfrastructureTokens.Logger)
    private readonly logger: ILogger

  ){ }

  connectRedis = async () => {

    try {
      this.logger.info("Connecting to redis");

      await this.redis.connect()

      this.logger.info("Connected to redis successfully")

    } catch (error) {
      this.logger.fatal("Failed to connect to Redis", error)
    }
  }

  disconnectRedis = async() => {
    try {
      this.logger.info("Disconnecting from redis")

      await this.redis.quit()

      this.logger.info("Disconnected from redis successfully")

    } catch (error) {
      this.logger.fatal("Failed to disconnect redis", error)
    }
  }

  checkRedisHealth = async() => {
    try {
      const start = process.hrtime.bigint();

      await this.redis.ping()

      const latency = Number(process.hrtime.bigint() - start) / 1_000_000;

      return {
        status: "healthy",
        latency
      }
    } catch (error) {
      this.logger.error("Redis health check failed", error)

      return {
        status: "unhealthy"
      }
    }
  }
}
