import { container } from "tsyringe"
import { env } from "../config/env.config.js"
import { app } from "./app.js"
import { InfrastructureTokens } from "../infrastructure/container/index.js"
import { ILogger } from "../shared/logger/logger.interface.js"

const port = env.PORT

export const createServer = () => {
  const logger = container.resolve<ILogger>(InfrastructureTokens.Logger)
  const server = app.listen(port, () => {
    logger.info(`Server running on PORT:${port}`)
  })

  return server
}
