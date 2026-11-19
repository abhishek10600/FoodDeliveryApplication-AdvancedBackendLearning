import { injectable, inject } from "tsyringe"
import { Prisma } from "../../../../../generated/prisma/client.js"
import { ProcessPaymentInput, ProcessPaymentResult } from "../dto/process-payment.dto.js";
import { PaymentProcessUseCase } from "./payment-process.use-case.js";
import { PaymentDomainError } from "../../domain/errors/payment-domain.error.js";
import { PaymentProvider } from "../../domain/enums/payment-provider.enum.js";
import { Payment } from "../../domain/entities/payment.entity.js";
import { PaymentTokens } from "../../infrastructure/persistence/tokens/payment.tokens.js";
import type { IPaymentRepository } from "../../domain/repositories/payment.repository.js";
import type { IPaymentOrderReader } from "../ports/payment-order-reader.port.js";
import { PaymentProcessorTokens } from "../../infrastructure/tokens/payment-processor.token.js";
import type { PaymentProcessor } from "../ports/payment-processor.port.js";
import { OutboxService } from "../../../../infrastructure/messaging/outbox/outbox.service.js";
import { PaymentStatus } from "../../domain/enums/payment-status.enum.js";
import { PaymentSucceededPayload, PaymentSucceededV1 } from "../../../../infrastructure/messaging/events/payment/payment-succeeded.v1.js";
import { PaymentFailedPayload, PaymentFailedV1 } from "../../../../infrastructure/messaging/events/payment/payment-failed.v1.js";
import { withTransaction } from "../../../../infrastructure/database/transaction.js";
import { PaymentEventTopics } from "../../../../infrastructure/messaging/topics/payment.event-topics.js";
import { EventFactory } from "../../../../infrastructure/messaging/events/event.factory.js";
import type { EventDefinition } from "../../../../infrastructure/messaging/events/event-definition.js";

@injectable()
export class PaymentProcessUseCaseImpl implements PaymentProcessUseCase {
  constructor(

    @inject(PaymentTokens.PaymentRepository)
    private readonly paymentRepo: IPaymentRepository,

    @inject(PaymentTokens.PaymentOrderReader)
    private readonly paymentOrderReader: IPaymentOrderReader,

    @inject(PaymentProcessorTokens.Processor)
    private readonly paymentProcessor: PaymentProcessor,

    private readonly outboxService: OutboxService,

    private readonly eventFactory: EventFactory

  ) { }

  async execute(input: ProcessPaymentInput): Promise<ProcessPaymentResult> {

    this.validateInput(input)

    const existingPayment = await this.paymentRepo.findByIdempotencyKey(input.idempotencyKey)

    if (existingPayment) {
      this.assertSameRequest(existingPayment, input)

      return this.handleExistingPayment(existingPayment)
    }

    const order = await this.paymentOrderReader.findPayableOrder(input.orderId, input.customerId)

    if (!order) {
      throw new PaymentDomainError("Payment order not found", 404)
    }

    if (order.status !== "PENDING_PAYMENT") {
      throw new PaymentDomainError("Payable order status is not PENDING_PAYMENT", 400)
    }

    const amount = Number(order.amount)

    if (!Number.isFinite(amount) || amount < 0) {
      throw new PaymentDomainError("Order amount is not a finite number or Order amount is less than 0", 400)
    }

    const amountMinor = this.toMinorUnits(String(amount))

    const orderPayment = await this.paymentRepo.findByOrderId(input.orderId)

    if (orderPayment) {
      throw new PaymentDomainError("Payment for this order already exists", 400)
    }

    const payment = Payment.create({
      orderId: input.orderId,
      provider: input.provider,
      status: PaymentStatus.PENDING,
      amount: amountMinor,
      currency: order.currency,
      idempotencyKey: input.idempotencyKey,
      createdAt: new Date()
    })

    let persistedPayment: Payment

    try {
      persistedPayment = await this.paymentRepo.create(payment)
    } catch (error) {

      if (!this.isUniqueConstraintError(error)) {
        throw error
      }

      const paymentByKey = await this.paymentRepo.findByIdempotencyKey(input.idempotencyKey)

      if (paymentByKey) {

        this.assertSameRequest(paymentByKey, input)

        return this.handleExistingPayment(paymentByKey)
      }

      throw new PaymentDomainError("Payment already exists", 400)
    }

    const claimed = await this.paymentRepo.claimForProcessing(persistedPayment.getId())

    if (!claimed) {
      const latest = await this.paymentRepo.findById(persistedPayment.getId())

      if (latest) {
        return this.toResult(latest)
      }

      throw new PaymentDomainError("Unable to retrieve the created payment", 400)
    }

    persistedPayment.markProcessing()

    const paymentProcessorResult = await this.paymentProcessor.process({
      paymentId: persistedPayment.getId(),
      orderId: persistedPayment.getOrderId(),
      amountMinor,
      currency: persistedPayment.getCurrency(),
      idempotencyKey: persistedPayment.getIdempotencyKey()
    })

    if (paymentProcessorResult.success) {
      persistedPayment.markSucceeded(paymentProcessorResult.providerRef)

      await this.persistResultAndEvent({
        payment: persistedPayment,
        correlationId: input.correlationId,
        definition: PaymentSucceededV1,
        payload: {
          paymentId: persistedPayment.getId(),
          orderId: persistedPayment.getOrderId(),
          amount: persistedPayment.getAmount(),
          currency: persistedPayment.getCurrency(),
          provider: persistedPayment.getProvider(),
          providerRef: paymentProcessorResult.providerRef,
          processedAt: persistedPayment.getProcessedAt()!.toISOString()
        }
      })
    } else {
      persistedPayment.markFailed(paymentProcessorResult.failureCode, paymentProcessorResult.failureMessage)

      await this.persistResultAndEvent({
        payment: persistedPayment,
        correlationId: input.correlationId,
        definition: PaymentFailedV1,
        payload: {
          paymentId: persistedPayment.getId(),
          orderId: persistedPayment.getOrderId(),
          amount: persistedPayment.getAmount(),
          currency: persistedPayment.getCurrency(),
          provider: persistedPayment.getProvider(),
          failureCode: paymentProcessorResult.failureCode,
          failureMessage: paymentProcessorResult.failureMessage,
          processedAt: persistedPayment.getProcessedAt()!.toISOString()
        } satisfies PaymentFailedPayload
      })
    }

    return this.toResult(persistedPayment)

  }

  private validateInput(input: ProcessPaymentInput): void {

    if (!input.customerId.trim()) {
      throw new PaymentDomainError("Customer Id is required", 400)
    }

    if (!input.orderId.trim()) {
      throw new PaymentDomainError("Order id is required", 400)
    }

    if (!input.idempotencyKey.trim()) {
      throw new PaymentDomainError("Idempotency key is required", 400)
    }

    if (!input.correlationId.trim()) {
      throw new PaymentDomainError("Correlation Id is required", 400)
    }

    if (input.provider !== PaymentProvider.DUMMY) {
      throw new PaymentDomainError("Unsupported payment provider", 400)
    }

  }

  private handleExistingPayment(payment: Payment): ProcessPaymentResult {

    return this.toResult(payment)

  }

  private assertSameRequest(payment: Payment, input: ProcessPaymentInput): void {

    if (payment.getOrderId() !== input.orderId || payment.getProvider() !== input.provider) {
      throw new PaymentDomainError("Idempotency key conflict", 400)
    }
  }

  private toMinorUnits(amount: string): number {

    const normalizedAmount = amount.trim()

    if (!/^\d+(\.\d{1,2})?$/.test(normalizedAmount)) {
      throw new PaymentDomainError("Invalid amount format", 400)
    }

    const [whole, fraction = ""] = normalizedAmount.split(".")

    const minor = Number(whole) * 100 + Number(fraction.padEnd(2, "0"))

    if (!Number.isSafeInteger(minor) || minor < 0) {
      throw new PaymentDomainError("Minor amount is less than zero or it is not a safe integer", 400)
    }

    return minor

  }

  private isUniqueConstraintError(error: unknown): boolean {
    if (typeof error === "object" && error !== null && "code" in error) {
      return error.code === "P2002"
    }

    return false
  }

  private async persistResultAndEvent<TPayload extends PaymentSucceededPayload | PaymentFailedPayload>(input: {
    payment: Payment
    correlationId: string
    definition: EventDefinition<TPayload>
    payload: TPayload
  }): Promise<void> {

    const event = this.eventFactory.create(input.definition, input.payload, {
      correlationId: input.correlationId,
      causationId: null
    },

    "foodflow-payment"

    )

    await withTransaction(async (tx) => {
      await this.paymentRepo.update(input.payment.getId(), input.payment, tx)

      await this.outboxService.save({
        eventId: event.id,
        eventType: event.eventType,
        eventVersion: event.eventVersion,
        aggregateId: input.payment.getId(),
        aggregateType: "Payment",
        topic: PaymentEventTopics.Payments,
        messageKey: input.payment.getId(),
        payload: event as unknown as Prisma.InputJsonValue,
        correlationId: event.correlationId,
        causationId: event.causationId ?? undefined,
        occurredAt: new Date(event.occurredAt)
      }, tx)
    })
  }

  private toResult(payment: Payment): ProcessPaymentResult {
    return {
      paymentId: payment.getId(),
      orderId: payment.getOrderId(),
      amount: payment.getAmount(),
      currency: payment.getCurrency(),
      status: payment.getStatus(),
      provider: payment.getProvider(),
      providerRef: payment.getProviderRef(),
      failureCode: payment.getFailureCode(),
      failureMessage: payment.getFailureMessage()
    }
  }
}
