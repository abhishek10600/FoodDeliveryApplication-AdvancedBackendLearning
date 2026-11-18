import { Prisma } from "../../../../../generated/prisma/client.js"
import { Payment } from "../entities/payment.entity.js";

export interface IPaymentRepository {

  findById(id: string): Promise<Payment | null>

  findByIdempotencyKey(idempotencyKey: string): Promise<Payment | null>

  findByOrderId(orderId: string): Promise<Payment | null>

  create(payment: Payment, tx?: Prisma.TransactionClient): Promise<Payment>

  update(id: string, payment: Payment, tx?: Prisma.TransactionClient): Promise<void>

  claimForProcessing(id: string): Promise<boolean>
}
