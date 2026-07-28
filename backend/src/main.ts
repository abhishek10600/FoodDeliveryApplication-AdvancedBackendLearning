import { app } from "./app/app.js";
import { env } from "./config/env.config.js";
import { logger } from "./config/logger.js";

const port = env.PORT

const server = app.listen(port, () => {
  logger.info(`Server running on PORT:${port}`)
})

const gracefulShutDown = (signal: string) => {

  logger.info(`${signal} received. Shutting down gracefully...`)

  server.close(async () => {
    process.exit(0)
  })
}

process.on("SIGINT", ()=> gracefulShutDown("SIGINT"))
process.on("SIGTERM", () => gracefulShutDown("SIGTERM"))

process.on("uncaughtException", (error) => {
  logger.error(error)

  process.exit(1);
})

process.on("unhandledRejection", (reason) => {
  logger.error(reason)

  process.exit(1);
})
