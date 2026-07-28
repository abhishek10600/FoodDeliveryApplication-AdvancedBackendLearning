import { Server } from "http"
import { logger } from "../config/logger.js"

export const shutdown = (server: Server, signal: string): void => {
  logger.info(`${signal} received. Shutting down gracefully...`)

  server.close(() => {
    logger.info("HTTP server closed.")

    process.exit(0);
  })
}
