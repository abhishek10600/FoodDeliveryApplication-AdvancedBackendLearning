import { env } from "../config/env.config.js"
import { logger } from "../config/logger.js"
import { app } from "./app.js"

const port = env.PORT

export const createServer = () => {
  const server = app.listen(port, () => {
    logger.info(`Server running on PORT:${port}`)
  })

  return server
}
