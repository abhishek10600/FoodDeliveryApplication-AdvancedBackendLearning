import { Payment } from "../entities/payment.entity.js";

export interface IPaymentRepository {

  findById(id: string): Promise<Payment | null>

  findByIdempotencyKey(idempotencyKey: string): Promise<Payment | null>

  findByOrderId(orderId: string): Promise<Payment | null>

  create(payment: Payment): Promise<Payment>

  update(id: string, payment: Payment): Promise<void>
}
