import { Server } from "http"
import { logger } from "../config/logger.js"
import { disconnectDatabase } from "../infrastructure/database/database.service.js"
import { disconnectRedis } from "../infrastructure/cache/redis.service.js"

export const shutdown = (server: Server, signal: string): void => {
  logger.info(`${signal} received. Shutting down gracefully...`)

  server.close(async () => {
    logger.info("HTTP server closed.")

    try {
      await disconnectDatabase()
      await disconnectRedis()
    } catch {
      process.exit(1)
    }

    process.exit(0);
  })
}
