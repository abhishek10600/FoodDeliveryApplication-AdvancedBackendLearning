import { injectable, inject } from "tsyringe"
import { InboxProcessor } from "../inbox/inbox.processor.js";
import { OrderTokens } from "../../../modules/ordering/infrastructure/persistence/tokens/order.token.js";
import type { IOrderRepository } from "../../../modules/ordering/domain/repositories/order.repository.js";
import { PaymentEventMessage } from "./payment-event-message.js";
import { PaymentEventTypes } from "../events/payment/payment.event-types.js";
import { PaymentFailedPayloadSchema } from "../events/payment/payment-failed.v1.js";
import { OrderDomainError } from "../../../modules/ordering/domain/errors/order.domain.error.js";
import { OrderStatus } from "../../../modules/ordering/domain/enums/order-status.enum.js";

const CONSUMER_NAME = "ordering-payment-result-consumer";

@injectable()
export class PaymentFailedHandler {
  constructor(

    private readonly inboxProcessor: InboxProcessor,

    @inject(OrderTokens.OrderRepository)
    private readonly orderRepo: IOrderRepository

  ) { }

  async handle(message: PaymentEventMessage): Promise<void> {

    if (message.type !== PaymentEventTypes.Failed) {
      throw new Error(`Unsupported payment event type: ${message.type}`)
    }

    if (message.version !== 1) {
      throw new Error(`Unsupported payment event version: ${message.version}`)
    }

    const payload = PaymentFailedPayloadSchema.parse(message.payload)

    await this.inboxProcessor.process({
      consumerName: CONSUMER_NAME,
      eventId: message.id
    }, async (tx) => {
      const order = await this.orderRepo.findByOrderIdInTransaction(payload.orderId, tx)

      if (!order) {
        throw new OrderDomainError(`Order not found: ${payload.orderId}`, 404)
      }

      if (payload.amount !== order.getTotal() || payload.currency !== order.getCurrency()) {
        throw new OrderDomainError("Payment amount or currency does not match the order", 409)
      }

      if (order.getStatus() === OrderStatus.PAYMENT_FAILED) {
        return
      }

      if (order.getStatus() !== OrderStatus.PENDING_PAYMENT) {
        throw new OrderDomainError(`Cannot mark payment as failed from order status ${order.getStatus()}`, 409)
      }

      order.markPaymentFailed()

      await this.orderRepo.updateInTransaction(order, tx)
    })

  }
}
