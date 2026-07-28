import { logger } from "../config/logger.js"

export const bootstrap = async (): Promise<void> => {
  logger.info("Bootstrapping application...")
}
