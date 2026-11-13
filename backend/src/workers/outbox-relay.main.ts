import "reflect-metadata"

import { container } from "tsyringe"
import { registerInfrastructure } from "../infrastructure/container/modules/infrastructure.js"
import { KafkaConnectionService } from "../infrastructure/messaging/kafka/kafka.connection.js"
import { OutboxRelayService } from "../infrastructure/messaging/outbox/outbox-relay.service.js"
import { ILogger } from "../shared/logger/logger.interface.js"
import { InfrastructureTokens } from "../infrastructure/container/index.js"

async function bootstrap(): Promise<void> {
  registerInfrastructure()

  const logger = container.resolve<ILogger>(InfrastructureTokens.Logger)

  const kafkaConnection = container.resolve(KafkaConnectionService)

  const relay = container.resolve(OutboxRelayService)

  await kafkaConnection.connect()

  let shuttingDown = false

  const shutdown = async (signal: string) => {

    if (shuttingDown) {
      return
    }

    shuttingDown = true

    logger.info(`Signal: ${signal} Outbox worker shutting down`)

    try {
      await relay.stop()

      await kafkaConnection.disconnect()

      logger.info("Outbox worker stopped successfully")

      process.exit(0)
    } catch (error) {

      logger.error(`err: ${error} , Outbox worker shutdown failed`)
      process.exitCode = 1
    }
  }

  process.once("SIGINT", () => {
    void shutdown("SIGINT")
  })

  process.once("SIGTERM", () => {
    void shutdown("SIGTERM")
  })

  await relay.start()
}

bootstrap().catch((error) => {

  const logger = container.resolve<ILogger>(InfrastructureTokens.Logger)

  logger.fatal(`Error: ${error} Outbox worker failed to start`)

  process.exitCode = 1
})
