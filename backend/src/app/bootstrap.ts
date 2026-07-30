import { logger } from "../config/logger.js"
import { connectRedis } from "../infrastructure/cache/redis.service.js"
import { connectDatabase } from "../infrastructure/database/database.service.js"
import { registerQueryLogger } from "../infrastructure/database/query-logger.js"

export const bootstrap = async (): Promise<void> => {
  logger.info("Bootstrapping application...")

  registerQueryLogger()

  await connectDatabase();

  await connectRedis();

  logger.info("Application bootstrapped successfully")
}
