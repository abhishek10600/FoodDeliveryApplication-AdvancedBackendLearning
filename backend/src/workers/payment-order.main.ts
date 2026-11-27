
import "reflect-metadata"

import { container } from "tsyringe"

import { registerInfrastructure } from "../infrastructure/container/modules/infrastructure.js"
import { registerPayment } from "../infrastructure/container/modules/payment.js"

import { InfrastructureTokens } from "../infrastructure/container/index.js"

import { KafkaTokens } from "../infrastructure/messaging/kafka/kafka.tokens.js"
import { KafkaConnectionService } from "../infrastructure/messaging/kafka/kafka.connection.js"

import { PaymentOrderConsumer } from "../infrastructure/messaging/consumers/payment-order.consumer.js"

import type { ILogger } from "../shared/logger/logger.interface.js"

async function bootstrap(): Promise<void> {

  registerInfrastructure()
  registerPayment()

  const logger = container.resolve<ILogger>(
    InfrastructureTokens.Logger
  )

  const kafkaConnection = container.resolve<KafkaConnectionService>(
    KafkaTokens.Connection
  )

  const paymentConsumer = container.resolve(PaymentOrderConsumer)

  await kafkaConnection.connect()

  let shuttingDown = false

  const shutdown = async (signal: string): Promise<void> => {

    if (shuttingDown) {
      return
    }

    shuttingDown = true

    logger.info(
      `Signal: ${signal}. Payment order worker shutting down`
    )

    try {

      await paymentConsumer.stop()
      await kafkaConnection.disconnect()

      logger.info("Payment order worker stopped successfully")

      process.exit(0)

    } catch (error) {

      logger.error(`err: ${error}, Payment Order worker shutdown failed`)

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

  logger.fatal(`Error: ${error}, Payment order worker failed to start`)

  process.exitCode = 1
})
