import { type Consumer } from "kafkajs"
import { injectable, inject } from "tsyringe"
import { KafkaTokens } from "../kafka.tokens.js"
import type { KafkaConnectionService, KafkaLogger } from "../kafka.connection.js"
import { KafkaConsumerOptions, KafkaMessageHandler } from "./kafka.consumer.types.js"
import { KafkaConnectionError } from "../kafka.errors.js"
import type { KafkaMessage } from "../kafka.types.js"

@injectable()
export class KafkaConsumerService {

  private consumer: Consumer | null = null
  private running = false
  private starting = false

  constructor(

    @inject(KafkaTokens.Connection)
    private readonly connection: KafkaConnectionService,

    @inject(KafkaTokens.Logger)
    private readonly logger: KafkaLogger

  ) { }

  private async cleanupConsumer(): Promise<void> {
    try { } catch (error) {
      this.logger.error({
        err: error,

      },
        "Kafka consumer cleanup failed"
      )
    } finally {
      this.consumer = null
      this.running = false
    }
  }

  async start<T>(options: KafkaConsumerOptions, handler: KafkaMessageHandler<T>): Promise<void> {
    if (this.running || this.starting || this.consumer) {
      throw new KafkaConnectionError("Kafka consumer is already running")
    }

    if (!options.groupId || options.topics.length === 0) {
      throw new KafkaConnectionError("Kafka consumer requires a group ID and at least on topic")
    }

    this.starting = true

    const consumer = this.connection.getClient().consumer({
      groupId: options.groupId
    })

    this.consumer = consumer

    try {
      await consumer.connect()

      for (const topic of options.topics) {
        await consumer.subscribe({
          topic,
          fromBeginning: options.fromBeginning ?? false
        })
      }

      await consumer.run({
        autoCommit: false,

        eachMessage: async ({
          topic,
          partition,
          message,
        }) => {
          if (!message.value) {
            throw new Error("Kafka message has an empty value")
          }

          const rawMessage = message.value.toString()

          const parsedMessage = JSON.parse(rawMessage) as KafkaMessage<T>

          try {
            await handler(parsedMessage, {
              topic,
              partition,
              offset: message.offset,
              key: message.key?.toString() ?? null
            })

            await consumer.commitOffsets([
              {
                topic,
                partition,
                offset: (
                  BigInt(message.offset) + 1n
                  ).toString()
              }
            ])

            this.logger.info({
              topic,
              partition,
              offset: message.offset,
              eventId: parsedMessage.id,
              eventType: parsedMessage.type
            },
              "Kafka message processed successfully"
            )

          } catch (error) {
            this.logger.error({
              err: error,
              topic,
              partition,
              offset: message.offset,
              eventId: parsedMessage.id
            },
            "Kafka message processing failed"
            )

            throw error
          }
        }
      })

      this.running = true

      this.logger.info(
        {
          groupId: options.groupId,
          topics: options.topics
        },

        "Kafka consumer started"
      )

    } catch (error) {
      await this.cleanupConsumer()

      throw new KafkaConnectionError("Failed to start Kafka consumer", {cause: error})
    }
  }

  async stop(): Promise<void> {
    if (!this.consumer) {
      return
    }

    try {

      await this.consumer.stop()
      await this.consumer.disconnect()

      this.logger.info({}, "Kafka consumer stopped successfully")

    } finally {

      this.consumer = null
      this.running = false
      this.starting = false
    }
  }

  isRunning(): boolean {
    return this.running
  }
}
