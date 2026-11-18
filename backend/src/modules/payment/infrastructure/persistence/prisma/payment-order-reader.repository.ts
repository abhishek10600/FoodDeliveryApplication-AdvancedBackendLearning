import { injectable, inject } from "tsyringe"
import { IPaymentOrderReader, PaymentOrderSnapshot } from "../../../application/ports/payment-order-reader.port.js";
import { InfrastructureTokens } from "../../../../../infrastructure/container/index.js";
import type { PrismaExecutor } from "../../../../../infrastructure/database/prisma-client.type.js";

@injectable()
export class PaymentOrderReader implements IPaymentOrderReader {
  constructor(

    @inject(InfrastructureTokens.PrismaClient)
    private readonly prisma: PrismaExecutor

  ) { }

  async findPayableOrder(orderId: string, customerId: string): Promise<PaymentOrderSnapshot | null> {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        customerId
      },

      select: {
        id: true,
        customerId: true,
        status: true,
        total: true,
        currency: true
      }
    })

    if (!order) {
      return null
    }

    return {
      orderId: order.id,
      customerId: order.customerId,
      status: order.status,
      amount: order.total.toNumber(),
      currency: order.currency
    }
  }
}
