import { logger } from "../../config/logger.js"
import { prisma } from "./prisma.js"

export const registerQueryLogger = (): void => {
  prisma.$on("query", (event) => {
    logger.debug(
      {
        component: "database",
        query: event.query,
        duration: event.duration,
        target: event.target
      },
      "Database query executed"
    )
  })
}
