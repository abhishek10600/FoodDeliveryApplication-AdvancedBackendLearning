import { container } from "tsyringe"
import { RedisService } from "../infrastructure/cache/redis.service.js"
import { DatabaseService } from "../infrastructure/database/database.service.js"
import { ILogger } from "../shared/logger/logger.interface.js"
import { InfrastructureTokens } from "../infrastructure/container/index.js"
import { KafkaConnectionService } from "../infrastructure/messaging/kafka/kafka.connection.js"
import { KafkaTokens } from "../infrastructure/messaging/kafka/kafka.tokens.js"

export const bootstrap = async (): Promise<void> => {

  const logger = container.resolve<ILogger>(InfrastructureTokens.Logger)

  logger.info("Bootstrapping application...")

  const databaseService = container.resolve(DatabaseService)
  const redisService = container.resolve(RedisService)

  await databaseService.connectDatabase()

  await redisService.connectRedis()

  const kafkaConnection = container.resolve<KafkaConnectionService>(
    KafkaTokens.Connection
  )

  await kafkaConnection.connect()

  await kafkaConnection.connectAdmin()

  logger.info("Application bootstrapped successfully")
}
