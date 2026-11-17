import { Payment as PrismaPayment, Prisma } from "../../../../../../../generated/prisma/client.js"
import { Payment } from "../../../../domain/entities/payment.entity.js";
import { PaymentProvider } from "../../../../domain/enums/payment-provider.enum.js";
import { PaymentStatus } from "../../../../domain/enums/payment-status.enum.js";

export class PaymentMapper {

  public static toDomain(prismaPayment: PrismaPayment): Payment {

    return Payment.rehydrate({
      id: prismaPayment.id,
      orderId: prismaPayment.orderId,
      provider: prismaPayment.provider as PaymentProvider,
      status: prismaPayment.status as PaymentStatus,
      amount: Number(prismaPayment.amount),
      currency: prismaPayment.currency,
      idempotencyKey: prismaPayment.idempotencyKey,
      providerRef: prismaPayment.providerRef,
      failureCode: prismaPayment.failureCode,
      failureMessage: prismaPayment.failureMessage,
      processedAt: prismaPayment.processedAt,
      createdAt: prismaPayment.createdAt,
      updatedAt: prismaPayment.updatedAt

    })
  }

  public static toPersistence(payment: Payment): Prisma.PaymentCreateInput {
    return {
      id: payment.getId(),
      order: {
        connect: {
          id: payment.getOrderId()
        }
      },
      provider: payment.getProvider(),
      status: payment.getStatus(),
      amount: payment.getAmount(),
      currency: payment.getCurrency(),
      idempotencyKey: payment.getIdempotencyKey(),
      providerRef: payment.getProviderRef(),
      failureCode: payment.getFailureCode(),
      failureMessage: payment.getFailureMessage(),
      createdAt: payment.getCreatedAt(),
      updatedAt: payment.getUpdatedAt()
    }
  }

  public static toUpdatePersistence(payment: Payment): Prisma.PaymentUpdateInput {
    return {
      id: payment.getId(),
      order: {
        connect: {
          id: payment.getOrderId()
        }
      },
      provider: payment.getProvider(),
      status: payment.getStatus(),
      amount: payment.getAmount(),
      currency: payment.getCurrency(),
      idempotencyKey: payment.getIdempotencyKey(),
      providerRef: payment.getProviderRef(),
      failureCode: payment.getFailureCode(),
      failureMessage: payment.getFailureMessage(),
      createdAt: payment.getCreatedAt(),
      updatedAt: payment.getUpdatedAt()
    }
  }

}
