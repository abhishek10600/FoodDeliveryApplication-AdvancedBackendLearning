import "reflect-metadata"

import { container } from "tsyringe"
import { registerInfrastructure } from "../infrastructure/container/modules/infrastructure.js"
import { KafkaConnectionService } from "../infrastructure/messaging/kafka/kafka.connection.js"
import { OutboxRelayService } from "../infrastructure/messaging/outbox/outbox-relay.service.js"
import { ILogger } from "../shared/logger/logger.interface.js"
import { InfrastructureTokens } from "../infrastructure/container/index.js"

const logger = container.resolve<ILogger>(InfrastructureTokens.Logger)

async function bootstrap(): Promise<void> {
  registerInfrastructure()

  const kafkaConnection = container.resolve(KafkaConnectionService)

  const relay = container.resolve(OutboxRelayService)

  await kafkaConnection.connect()

  const shutdown = async (signal: string) => {
    logger.info(`Signal: ${signal} Outbox worker shutting down`)

    await relay.stop()

    await kafkaConnection.disconnect()

    process.exit(0)
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
  logger.fatal(`Error: ${error} Outbox worker failed to start`)

  process.exit(1)
})
