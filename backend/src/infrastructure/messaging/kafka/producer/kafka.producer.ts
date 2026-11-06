import { injectable, inject } from "tsyringe"
import { KafkaTokens } from "../kafka.tokens.js";
import type { KafkaConnectionService, KafkaLogger } from "../kafka.connection.js";
import { KafkaMessage } from "../kafka.types.js";

@injectable()
export class KafkaProducerService {
  constructor(

    @inject(KafkaTokens.Connection)
    private readonly connection: KafkaConnectionService,

    @inject(KafkaTokens.Logger)
    private readonly logger: KafkaLogger

  ) { }

  async publish<T>(options: {
    topic: string
    message: KafkaMessage<T>
  }): Promise<void> {
    const { topic, message } = options

    try {
      await this.connection.getProducer().send({
        topic,

        acks: -1,

        messages: [
          {
            key: message.key,
            value: JSON.stringify(message),
            timestamp: String(new Date(message.timestamp).getTime()),

            headers: {
              eventId: message.id,
              eventType: message.type,
              eventVersion: String(message.version),
              correlationId: message.correlationId ?? "",
              causationId: message.causationId ?? ""
            }
          }
        ]
      })

      this.logger.info(
        {
          topic,
          eventId: message.id,
          eventType: message.type,
          key: message.key
        },

        "Kafka message published successfully"
      )

    } catch (error) {
      this.logger.error({
        err: error,
        topic,
        eventId: message.id,
        eventType: message.type,
      },
        "Failed to publish kafka message")

      throw error
    }
  }

  async publishBatch<T>(options: {
    topic: string
    messages: KafkaMessage<T>[]
  }): Promise<void> {
    const { topic, messages } = options

    if (messages.length === 0) {
      return
    }

    try {
      await this.connection.getProducer().send({
        topic,

        acks: -1,

        messages: messages.map((message) => ({
          key: message.key,
          value: JSON.stringify(message),
          timestamp: String(new Date(message.timestamp).getTime()),

          headers: {
            eventId: message.id,
            eventType: message.type,
            eventVersion: String(message.version),
            correlation: message.correlationId ?? "",
            causationId: message.causationId ?? ""
          }
        }))
      })

      this.logger.info({
        topic,
        messageCount: messages.length
      },
      "Kafka batch published successfully"
    )
    } catch (error) {
      this.logger.error({
        err: error,
        topic,
        messageCount: messages.length
      },
      "Failed to publish Kafka batch"
      )

      throw error;
    }
  }
}
