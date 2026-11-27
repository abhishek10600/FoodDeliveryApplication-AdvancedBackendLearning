
import { injectable } from "tsyringe"

import { KafkaConsumerService } from "../kafka/consumer/kafka.consumer.js"
import { OrderEventTopics } from "../topics/order.event-topics.js"

import { OrderPlacedHandler } from "./order-placed.handler.js"

@injectable()
export class PaymentOrderConsumer {

  private readonly groupId = "payment-order-placed-consumer"

  constructor(
    private readonly consumer: KafkaConsumerService,
    private readonly orderPlacedHandler: OrderPlacedHandler
  ) {}

  async start(): Promise<void> {

    await this.consumer.start<unknown>(
      {
        groupId: this.groupId,
        topics: [OrderEventTopics.Orders],
        fromBeginning: true
      },
      async (message) => {
        await this.orderPlacedHandler.handle(message)
      }
    )
  }

  async stop(): Promise<void> {
    await this.consumer.stop()
  }
}
