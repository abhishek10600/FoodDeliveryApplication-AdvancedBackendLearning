import { injectable } from "tsyringe"
import { PaymentSucceededHandler } from "./payment-succeeded.handler.js"
import { PaymentFailedHandler } from "./payment-failed.handler.js"
import { PaymentEventTopics } from "../topics/payment.event-topics.js"
import { KafkaConsumerService } from "../kafka/consumer/kafka.consumer.js"
import { PaymentEventMessage } from "./payment-event-message.js"
import { PaymentEventTypes } from "../events/payment/payment.event-types.js"

@injectable()
export class OrderingPaymentConsumer {

  private readonly groupId = "ordering-payment-result-consumer"

  constructor(

    private readonly consumer: KafkaConsumerService,
    private readonly paymentSucceededHandler: PaymentSucceededHandler,
    private readonly paymentFailedHandler: PaymentFailedHandler

  ) { }

  async start(): Promise<void> {

    await this.consumer.start<unknown>({

      groupId: this.groupId,
      topics: [PaymentEventTopics.Payments],
      fromBeginning: false

    }, async (message) => {

      const paymentMessage = message as PaymentEventMessage

      if (paymentMessage.type === PaymentEventTypes.Succeeded) {

        await this.paymentSucceededHandler.handle(message)

        return

      } else if (paymentMessage.type === PaymentEventTypes.Failed) {

        await this.paymentFailedHandler.handle(message)

        return

      } else {
        throw new Error(`Unsupported payment event: ${paymentMessage.type}`)
      }

    })

  }

  async stop(): Promise<void> {

    await this.consumer.stop()

  }

}
