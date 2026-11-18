import { injectable, inject } from "tsyringe"
import { IPaymentRepository } from "../../../domain/repositories/payment.repository.js";
import { InfrastructureTokens } from "../../../../../infrastructure/container/index.js";
import type { PrismaExecutor } from "../../../../../infrastructure/database/prisma-client.type.js";
import { Payment } from "../../../domain/entities/payment.entity.js";
import { PaymentMapper } from "./mappers/payment.mapper.js";
import { Prisma } from "../../../../../../generated/prisma/client.js"

@injectable()
export class PaymentRepository implements IPaymentRepository {

  constructor(

    @inject(InfrastructureTokens.PrismaClient)
    private readonly prisma: PrismaExecutor

  ) { }

  async findById(id: string): Promise<Payment | null> {

    const payment = await this.prisma.payment.findUnique({
      where: {
        id
      }
    })

    if (!payment) {
      return null
    }

    return PaymentMapper.toDomain(payment)
  }

  async findByIdempotencyKey(idempotencyKey: string): Promise<Payment | null> {

    const payment = await this.prisma.payment.findUnique({
      where: {
        idempotencyKey
      }
    })

    if (!payment) {
      return null
    }

    return PaymentMapper.toDomain(payment)
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {

    const payment = await this.prisma.payment.findUnique({
      where: {
        orderId
      }
    })

    if (!payment) {
      return null
    }

    return PaymentMapper.toDomain(payment)
  }

  async create(payment: Payment, tx: Prisma.TransactionClient): Promise<Payment> {

    const executor = tx ?? this.prisma

    const data = PaymentMapper.toPersistence(payment)

    const createdPayment = await executor.payment.create({
      data
    })

    return PaymentMapper.toDomain(createdPayment)

  }

  async update(id: string, payment: Payment, tx?: Prisma.TransactionClient): Promise<void> {

    const executor = tx ?? this.prisma

    const data = PaymentMapper.toUpdatePersistence(payment)

    await executor.payment.update({
      where: {
        id
      },
      data
    })
  }

  async claimForProcessing(id: string): Promise<boolean> {
    const result = await this.prisma.payment.updateMany({
      where: {
        id,
        status: "PENDING"
      },
      data: {
        status: "PROCESSING"
      }
    })

    return result.count === 1
  }

}
