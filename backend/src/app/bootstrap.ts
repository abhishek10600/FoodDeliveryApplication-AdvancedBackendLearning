import { container } from "tsyringe"
import { logger } from "../config/logger.js"
import { RedisService } from "../infrastructure/cache/redis.service.js"
import { DatabaseService } from "../infrastructure/database/database.service.js"

export const bootstrap = async (): Promise<void> => {
  logger.info("Bootstrapping application...")

  const databaseService = container.resolve(DatabaseService)
  const redisService = container.resolve(RedisService)

  await databaseService.connectDatabase()

  await redisService.connectRedis()

  logger.info("Application bootstrapped successfully")
}
