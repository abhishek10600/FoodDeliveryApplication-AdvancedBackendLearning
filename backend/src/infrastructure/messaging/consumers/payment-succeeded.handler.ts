import { injectable, inject } from "tsyringe"
import { OrderTokens } from "../../../modules/ordering/infrastructure/persistence/tokens/order.token.js";
import type { IOrderRepository } from "../../../modules/ordering/domain/repositories/order.repository.js";
import { InboxProcessor } from "../inbox/inbox.processor.js";
import { PaymentEventMessage } from "./payment-event-message.js";
import { PaymentEventTypes } from "../events/payment/payment.event-types.js";
import { PaymentSucceededPayloadSchema } from "../events/payment/payment-succeeded.v1.js";
import { OrderDomainError } from "../../../modules/ordering/domain/errors/order.domain.error.js";
import { OrderStatus } from "../../../modules/ordering/domain/enums/order-status.enum.js";

const CONSUMER_NAME = "ordering-payment-result-consumer"

@injectable()
export class PaymentSucceededHandler {

  constructor(

    private readonly inboxProcessor: InboxProcessor,

    @inject(OrderTokens.OrderRepository)
    private readonly orderRepo: IOrderRepository

  ) { }

  async handle(message: PaymentEventMessage): Promise<void> {

    if (message.type !== PaymentEventTypes.Succeeded) {
      throw new Error(`Unsupported payment event type: ${message.type}`)
    }

    if (message.version !== 1) {
      throw new Error(`Unsupported payment event version: ${message.version}`)
    }

    const payload = PaymentSucceededPayloadSchema.parse(message.payload)

    await this.inboxProcessor.process(
      {
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

        if (order.getStatus() === OrderStatus.CONFIRMED) {
          return;
        }

        if (order.getStatus() !== OrderStatus.PENDING_PAYMENT) {
          throw new OrderDomainError(`Cannot confirm order from status ${order.getStatus()}`, 409)
        }

        order.confirm()

        await this.orderRepo.updateInTransaction(order, tx)
      })
  }

}
