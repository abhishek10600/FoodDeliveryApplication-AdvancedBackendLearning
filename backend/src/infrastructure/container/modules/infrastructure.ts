import { container } from "tsyringe"
import { InfrastructureTokens } from "../tokens/infrastructure.tokens.js"
import { env } from "../../../config/env.config.js"
import { logger } from "../../../config/logger.js"
import { prisma } from "../../database/prisma.js"
import redis from "../../cache/redis.js"
import { DatabaseService } from "../../database/database.service.js"
import { RedisService } from "../../cache/redis.service.js"
import { CacheService } from "../../cache/cache.service.js"

export const registerInfrastructure = (): void => {

  container.registerInstance(InfrastructureTokens.Configuration, env)

  container.registerInstance(InfrastructureTokens.Logger, logger)

  container.registerInstance(InfrastructureTokens.PrismaClient, prisma)

  container.registerInstance(InfrastructureTokens.RedisClient, redis)

  container.register(
    InfrastructureTokens.DatabaseService,
    {
      useClass: DatabaseService
    }
  )

  container.register(
    InfrastructureTokens.RedisService,
    {
      useClass: RedisService
    }
  )

  container.register(
    InfrastructureTokens.CacheService,
    {
      useClass: CacheService
    }
  )

}
