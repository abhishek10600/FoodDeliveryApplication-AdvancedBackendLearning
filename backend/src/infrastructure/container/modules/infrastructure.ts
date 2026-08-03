import { container } from "tsyringe"
import { InfrastructureTokens } from "../tokens/infrastructure.tokens.js"
import { env } from "../../../config/env.config.js"
import { prisma } from "../../database/prisma.js"
import redis from "../../cache/redis.js"
import { DatabaseService } from "../../database/database.service.js"
import { RedisService } from "../../cache/redis.service.js"
import { CacheService } from "../../cache/cache.service.js"
import { HealthService } from "../../observeability/health.service.js"
import { ApiService } from "../../../app/health.service.js"
import { LoggerService } from "../../observeability/logger/logger.service.js"
import { pinoLogger } from "../../observeability/logger/pino.js"
import { Logger } from "pino"
import { LoggerFactory } from "../../observeability/logger/logger.factory.js"
import { HttpLogger } from "../../observeability/logger/http.logger.js"

export const registerInfrastructure = (): void => {

  container.registerInstance(InfrastructureTokens.Configuration, env)

  container.registerInstance(
    InfrastructureTokens.PinoLogger,
    pinoLogger
  );

  container.register(
    InfrastructureTokens.Logger,
    {
      useFactory: c =>
      new LoggerService(
              c.resolve<Logger>(InfrastructureTokens.PinoLogger)
      )
    }
  )

  container.registerSingleton(LoggerFactory)

  container.registerSingleton(HttpLogger)

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

  container.register(
    InfrastructureTokens.ApiService,
    {
      useClass: ApiService
    }
  )

  container.register(
    InfrastructureTokens.HealthService,
    {
      useClass: HealthService
    }
  )

}
