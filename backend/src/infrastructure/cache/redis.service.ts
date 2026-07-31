import { injectable, inject } from "tsyringe";
import { InfrastructureTokens } from "../container/index.js";
import type { Redis } from "ioredis";
import type { Logger } from "pino";

@injectable()
export class RedisService {

  constructor(

    @inject(InfrastructureTokens.RedisClient)
    private readonly redis: Redis,

    @inject(InfrastructureTokens.Logger)
    private readonly logger: Logger

  ){ }

  connectRedis = async () => {

    try {
      this.logger.info("Connecting to redis");

      await this.redis.connect()

      this.logger.info("Connected to redis successfully")

    } catch (error) {
      this.logger.fatal({
        error
      }, "Failed to connect to Redis")
    }
  }

  disconnectRedis = async() => {
    try {
      this.logger.info("Disconnecting from redis")

      await this.redis.quit()

      this.logger.info("Disconnected from redis successfully")

    } catch (error) {
      this.logger.fatal({
        error
      }, "Failed to disconnect redis")
    }
  }
}
