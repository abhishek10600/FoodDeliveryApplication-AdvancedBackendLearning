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
    private readonly logger: ILogger,

  ){ }

connectRedis = async (): Promise<void> => {
  try {
    this.logger.info("Connecting to Redis");

    console.log("Redis status:", this.redis.status);

    if (this.redis.status === "wait") {

      await this.redis.connect();

    } else if (this.redis.status === "connecting") {

      await new Promise<void>((resolve, reject) => {

        this.redis.once("ready", resolve);
        this.redis.once("error", reject);

      });
    } else if (this.redis.status !== "ready") {

      throw new Error(`Unexpected Redis status: ${this.redis.status}`);
    }
    this.logger.info("Redis connected out of the if")

    this.logger.info("Connected to Redis successfully");

  } catch (error) {
    console.error("REDIS ERROR:", error);

    this.logger.fatal("Failed to connect to Redis", error);

    throw error;
  }
};

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
