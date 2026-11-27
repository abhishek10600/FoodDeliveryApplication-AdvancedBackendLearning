import { injectable } from "tsyringe"
import { InboxProcessor } from "../inbox/inbox.processor.js"
import { PaymentProcessUseCaseImpl } from "../../../modules/payment/application/use-cases/payment-process.use-case.impl.js"
import { KafkaMessage } from "../kafka/kafka.types.js"
import { OrderPlacedV1 } from "../events/ordering/order-place.v1.js"
import { PaymentProvider } from "../../../modules/payment/domain/enums/payment-provider.enum.js"


const CONSUMER_NAME = "payment-order-placed-consumer"

@injectable()
export class OrderPlacedHandler {

  constructor(

    private readonly inboxProcessor: InboxProcessor,
    private readonly paymentProcessUseCase: PaymentProcessUseCaseImpl

  ) { }

  async handle(message: KafkaMessage): Promise<void> {

    if (message.type !== OrderPlacedV1.eventType) {
      throw new Error(`Unsupported event type: ${message.type}`)
    }

    if (message.version !== OrderPlacedV1.eventVersion) {
      throw new Error(`Unsupported event version: ${message.version}`)
    }

    if (!message.correlationId?.trim()) {
      throw new Error(`Correlation ID is required`)
    }

    const rawPayload = message.payload

    const businessPayload =
      rawPayload !== null &&
      typeof rawPayload === "object" &&
      "payload" in rawPayload
        ? rawPayload.payload
        : rawPayload

    const payload = OrderPlacedV1.payloadSchema.parse(businessPayload)

    await this.paymentProcessUseCase.execute({
      orderId: payload.orderId,
      customerId: payload.customerId,
      provider: PaymentProvider.DUMMY,
      idempotencyKey: `foodflow:payment:order:${payload.orderId}`,
      correlationId: message.correlationId
    })

    await this.inboxProcessor.process({

      consumerName: CONSUMER_NAME,
      eventId: message.id

    }, async () => { })

  }

}
