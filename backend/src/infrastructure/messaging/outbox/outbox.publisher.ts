import { injectable, inject } from "tsyringe"
import { KafkaProducerService } from "../kafka/producer/kafka.producer.js";
import { OutboxClaimedEvent } from "./outbox.types.js";

@injectable()
export class OutboxPublisher {
  constructor(

    @inject(KafkaProducerService)
    private readonly producer: KafkaProducerService

  ) { }

  async publish(event: OutboxClaimedEvent): Promise<void> {
    await this.producer.publishBatch({
      topic: event.topic,
      messages: [
        {
          key: event.messageKey,
          payload: event.payload,
          id: event.eventId,
          type: event.eventType,
          version: event.eventVersion,
          correlationId: event.correlationId,
          causationId: event.causationId ?? "",
          timestamp: String(event.occurredAt),
        }
      ]
    })
  }
}
