import "reflect-metadata"

import { container } from "tsyringe"
import { registerInfrastructure } from "../infrastructure/container/modules/infrastructure.js"
import { registerOrdering } from "../infrastructure/container/modules/ordering.js"
import { ILogger } from "../shared/logger/logger.interface.js"
import { InfrastructureTokens } from "../infrastructure/container/index.js"
import { KafkaConnectionService } from "../infrastructure/messaging/kafka/kafka.connection.js"
import { OrderingPaymentConsumer } from "../infrastructure/messaging/consumers/ordering-payment.consumer.js"
import { KafkaTokens } from "../infrastructure/messaging/kafka/kafka.tokens.js"

async function bootstrap(): Promise<void> {

  registerInfrastructure()

  registerOrdering()

  const logger = container.resolve<ILogger>(InfrastructureTokens.Logger)

  const kafkaConnection = container.resolve<KafkaConnectionService>(KafkaTokens.Connection)

  const paymentConsumer = container.resolve(OrderingPaymentConsumer)

  await kafkaConnection.connect()

  let shuttingDown = false;

  const shutdown = async (signal: string): Promise<void> => {

    if (shuttingDown) {
      return
    }

    shuttingDown = true

    logger.info(`Singal: ${signal} Ordering payment consumer shutting down`)

    try {

      await paymentConsumer.stop()

      await kafkaConnection.disconnect()

      logger.info("Ordering Payment worker stopped successfully")

      process.exit(0)

    } catch (error) {
      logger.error(`err: ${error}, Ordering payment consumer failed`)

      process.exitCode = 1
    }
  }

  process.once("SIGINT", () => {
    void shutdown("SIGINT")
  })

  process.once("SIGTERM", () => {
    void shutdown("SIGTERM")
  })

  await paymentConsumer.start()

}

bootstrap().catch((error) => {
  const logger = container.resolve<ILogger>(
    InfrastructureTokens.Logger
  )

  logger.fatal(`Error: ${error}, Ordering payment consumer failed to start`)

  process.exitCode = 1
})
