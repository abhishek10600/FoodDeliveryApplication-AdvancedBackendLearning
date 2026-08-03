import { container } from "tsyringe"
import { prisma } from "./prisma.js"
import { ILogger } from "../../shared/logger/logger.interface.js"
import { InfrastructureTokens } from "../container/index.js"

export const registerQueryLogger = (): void => {

  const logger = container.resolve<ILogger>(InfrastructureTokens.Logger)

  prisma.$on("query", (event) => {
    logger.debug(
    "Database query executed",
      {
        component: "database",
        query: event.query,
        duration: event.duration,
        target: event.target
      }
    )
  })
}
