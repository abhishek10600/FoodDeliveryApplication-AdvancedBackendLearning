import { beforeEach, describe, expect, it, vi } from "vitest"

import { PaymentProcessUseCaseImpl } from "../../../src/modules/payment/application/use-cases/payment-process.use-case.impl.js"

import { Payment } from "../../../src/modules/payment/domain/entities/payment.entity.js"
import { PaymentStatus } from "../../../src/modules/payment/domain/enums/payment-status.enum.js"
import { PaymentProvider } from "../../../src/modules/payment/domain/enums/payment-provider.enum.js"

import type { IPaymentRepository } from "../../../src/modules/payment/domain/repositories/payment.repository.js"
import type { PaymentProcessor } from "../../../src/modules/payment/application/ports/payment-processor.port.js"
import type { IPaymentOrderReader } from "../../../src/modules/payment/application/ports/payment-order-reader.port.js"

import type { OutboxService } from "../../../src/infrastructure/messaging/outbox/outbox.service.js"
import type { EventFactory } from "../../../src/infrastructure/messaging/events/event.factory.js"

import { PaymentEventTopics } from "../../../src/infrastructure/messaging/topics/payment.event-topics.js"
import { withTransaction } from "../../../src/infrastructure/database/transaction.js"
import { PaymentDomainError } from "../../../src/modules/payment/domain/errors/payment-domain.error.js"

vi.mock("../../../src/infrastructure/database/transaction.js", () => ({
  withTransaction: vi.fn(async (operation) => {
    return operation({ transaction: true })
  })
}))

describe("PaymentProcessUseCaseImpl", () => {
  let paymentRepository: {
    findById: ReturnType<typeof vi.fn>
    findByIdempotencyKey: ReturnType<typeof vi.fn>
    findByOrderId: ReturnType<typeof vi.fn>
    create: ReturnType<typeof vi.fn>
    update: ReturnType<typeof vi.fn>
    claimForProcessing: ReturnType<typeof vi.fn>
  }

  let orderReader: {
    findPayableOrder: ReturnType<typeof vi.fn>
  }

  let processor: {
    process: ReturnType<typeof vi.fn>
  }

  let outboxService: {
    save: ReturnType<typeof vi.fn>
  }

  let eventFactory: {
    create: ReturnType<typeof vi.fn>
  }

  let useCase: PaymentProcessUseCaseImpl

  const input = {
    orderId: "order-123",
    customerId: "customer-123",
    provider: PaymentProvider.DUMMY,
    idempotencyKey: "payment-request-123",
    correlationId: "11111111-1111-4111-8111-111111111111"
  }

  // Matches PaymentOrderSnapshot: amount is a number
  const order = {
    orderId: input.orderId,
    customerId: input.customerId,
    status: "PENDING_PAYMENT",
    amount: 250,
    currency: "INR"
  }

  const createExistingPayment = (
    status: PaymentStatus = PaymentStatus.PENDING
  ) => {
    const payment = Payment.create({
      orderId: input.orderId,
      provider: PaymentProvider.DUMMY,
      status: PaymentStatus.PENDING,
      amount: 25000,
      currency: "INR",
      idempotencyKey: input.idempotencyKey,
      createdAt: new Date()
    })

    if (status === PaymentStatus.PROCESSING) {
      payment.markProcessing()
    }

    if (status === PaymentStatus.SUCCEEDED) {
      payment.markProcessing()
      payment.markSucceeded("dummy-ref")
    }

    if (status === PaymentStatus.FAILED) {
      payment.markProcessing()
      payment.markFailed("DECLINED", "Payment declined")
    }

    return payment
  }

  beforeEach(() => {
    vi.clearAllMocks()

    paymentRepository = {
      findById: vi.fn(),
      findByIdempotencyKey: vi.fn().mockResolvedValue(null),
      findByOrderId: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
      update: vi.fn().mockResolvedValue(undefined),
      claimForProcessing: vi.fn().mockResolvedValue(true)
    }

    orderReader = {
      findPayableOrder: vi.fn().mockResolvedValue(order)
    }

    processor = {
      process: vi.fn()
    }

    outboxService = {
      save: vi.fn().mockResolvedValue(undefined)
    }

    // Argument order matches the use case call:
    // create(definition, payload, { correlationId, causationId }, producer)
    eventFactory = {
      create: vi.fn((definition, payload, metadata, producer) => ({
        id: crypto.randomUUID(),
        eventType: definition.eventType,
        eventVersion: definition.eventVersion,
        occurredAt: new Date().toISOString(),
        producer,
        correlationId: metadata.correlationId,
        causationId: metadata.causationId,
        payload
      }))
    }

    paymentRepository.create.mockImplementation(
      async (payment: Payment) => payment
    )

    useCase = new PaymentProcessUseCaseImpl(
      paymentRepository as unknown as IPaymentRepository,
      orderReader as unknown as IPaymentOrderReader,
      processor as unknown as PaymentProcessor,
      outboxService as unknown as OutboxService,
      eventFactory as unknown as EventFactory
    )
  })

  describe("successful payment", () => {
    it("should create and process a payment successfully", async () => {
      processor.process.mockResolvedValue({
        success: true,
        providerRef: "dummy-provider-ref"
      })

      const result = await useCase.execute(input)

      expect(paymentRepository.create).toHaveBeenCalledOnce()
      expect(paymentRepository.claimForProcessing).toHaveBeenCalledOnce()

      expect(processor.process).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentId: expect.any(String),
          orderId: input.orderId,
          amountMinor: 25000,
          currency: "INR",
          idempotencyKey: input.idempotencyKey
        })
      )

      expect(result.status).toBe(PaymentStatus.SUCCEEDED)
      expect(result.providerRef).toBe("dummy-provider-ref")
      expect(result.failureCode).toBeNull()

      expect(paymentRepository.update).toHaveBeenCalledOnce()
      expect(outboxService.save).toHaveBeenCalledOnce()
    })

    it("should persist the payment success event", async () => {
      processor.process.mockResolvedValue({
        success: true,
        providerRef: "dummy-provider-ref"
      })

      await useCase.execute(input)

      expect(outboxService.save).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: "payment.payment-succeeded",
          eventVersion: 1,
          aggregateId: expect.any(String),
          aggregateType: "Payment",
          topic: PaymentEventTopics.Payments,
          correlationId: input.correlationId
        }),
        expect.anything()
      )
    })
  })

  describe("failed payment", () => {
    it("should mark the payment as FAILED when processor declines", async () => {
      processor.process.mockResolvedValue({
        success: false,
        failureCode: "DUMMY_PAYMENT_DECLINED",
        failureMessage: "Payment declined"
      })

      const result = await useCase.execute(input)

      expect(result.status).toBe(PaymentStatus.FAILED)
      expect(result.failureCode).toBe("DUMMY_PAYMENT_DECLINED")
      expect(result.failureMessage).toBe("Payment declined")

      expect(paymentRepository.update).toHaveBeenCalledOnce()
      expect(outboxService.save).toHaveBeenCalledOnce()
    })

    it("should persist the payment failure event", async () => {
      processor.process.mockResolvedValue({
        success: false,
        failureCode: "DUMMY_PAYMENT_DECLINED",
        failureMessage: "Payment declined"
      })

      await useCase.execute(input)

      expect(outboxService.save).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: "payment.payment-failed",
          eventVersion: 1,
          aggregateType: "Payment",
          topic: PaymentEventTopics.Payments,
          correlationId: input.correlationId
        }),
        expect.anything()
      )
    })
  })

  describe("idempotency", () => {
    it("should return the existing payment for a duplicate request", async () => {
      const existingPayment = createExistingPayment(PaymentStatus.SUCCEEDED)

      paymentRepository.findByIdempotencyKey.mockResolvedValue(existingPayment)

      const result = await useCase.execute(input)

      expect(result.paymentId).toBe(existingPayment.getId())
      expect(result.status).toBe(PaymentStatus.SUCCEEDED)

      expect(paymentRepository.create).not.toHaveBeenCalled()
      expect(processor.process).not.toHaveBeenCalled()
      expect(outboxService.save).not.toHaveBeenCalled()
    })

    it("should not process an existing PROCESSING payment again", async () => {
      const existingPayment = createExistingPayment(PaymentStatus.PROCESSING)

      paymentRepository.findByIdempotencyKey.mockResolvedValue(existingPayment)

      const result = await useCase.execute(input)

      expect(result.status).toBe(PaymentStatus.PROCESSING)
      expect(processor.process).not.toHaveBeenCalled()
      expect(paymentRepository.create).not.toHaveBeenCalled()
    })

    it("should reject an idempotency key reused for another order", async () => {
      const existingPayment = createExistingPayment()

      paymentRepository.findByIdempotencyKey.mockResolvedValue(existingPayment)

      await expect(
        useCase.execute({
          ...input,
          orderId: "another-order"
        })
      ).rejects.toThrow("Idempotency key conflict")

      expect(processor.process).not.toHaveBeenCalled()
    })
  })

  describe("order validation", () => {
    it("should reject a missing order", async () => {
      orderReader.findPayableOrder.mockResolvedValue(null)

      await expect(useCase.execute(input)).rejects.toThrow(
        "Payment order not found"
      )

      expect(paymentRepository.create).not.toHaveBeenCalled()
      expect(processor.process).not.toHaveBeenCalled()
    })

    it("should reject an order that is not pending payment", async () => {
      orderReader.findPayableOrder.mockResolvedValue({
        ...order,
        status: "CONFIRMED"
      })

      await expect(useCase.execute(input)).rejects.toThrow(
        "Payable order status is not PENDING_PAYMENT"
      )

      expect(paymentRepository.create).not.toHaveBeenCalled()
      expect(processor.process).not.toHaveBeenCalled()
    })

    it("should reject a non-finite order amount", async () => {
      orderReader.findPayableOrder.mockResolvedValue({
        ...order,
        amount: Number.NaN
      })

      await expect(useCase.execute(input)).rejects.toThrow(
        "Order amount is not a finite number or Order amount is less than 0"
      )

      expect(paymentRepository.create).not.toHaveBeenCalled()
      expect(processor.process).not.toHaveBeenCalled()
    })

    it("should reject a negative order amount", async () => {
      orderReader.findPayableOrder.mockResolvedValue({
        ...order,
        amount: -1
      })

      await expect(useCase.execute(input)).rejects.toThrow(PaymentDomainError)

      expect(paymentRepository.create).not.toHaveBeenCalled()
      expect(processor.process).not.toHaveBeenCalled()
    })

    it("should reject an amount with more than two decimal places", async () => {
      orderReader.findPayableOrder.mockResolvedValue({
        ...order,
        amount: 10.123
      })

      await expect(useCase.execute(input)).rejects.toThrow(
        "Invalid amount format"
      )

      expect(paymentRepository.create).not.toHaveBeenCalled()
      expect(processor.process).not.toHaveBeenCalled()
    })
  })

  describe("transactional outbox", () => {
    it("should persist payment update and outbox event in one transaction", async () => {
      processor.process.mockResolvedValue({
        success: true,
        providerRef: "dummy-provider-ref"
      })

      await useCase.execute(input)

      expect(withTransaction).toHaveBeenCalledOnce()

      const transactionCallback = vi.mocked(withTransaction).mock.calls[0][0]

      expect(transactionCallback).toBeDefined()

      // Both operations must receive the transaction client
      // supplied by the same transaction callback.
      expect(paymentRepository.update).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Payment),
        expect.objectContaining({ transaction: true })
      )

      expect(outboxService.save).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ transaction: true })
      )
    })

    it("should not persist the final payment update if the outbox insert fails", async () => {
      processor.process.mockResolvedValue({
        success: true,
        providerRef: "dummy-provider-ref"
      })

      outboxService.save.mockRejectedValue(new Error("Outbox insert failed"))

      await expect(useCase.execute(input)).rejects.toThrow(
        "Outbox insert failed"
      )

      // The application attempted the update inside the transaction.
      // The real database transaction must roll it back.
      expect(paymentRepository.update).toHaveBeenCalledOnce()
      expect(outboxService.save).toHaveBeenCalledOnce()
    })
  })

  describe("processor operational failures", () => {
    it("should propagate processor exceptions instead of marking payment FAILED", async () => {
      processor.process.mockRejectedValue(new Error("Provider timeout"))

      await expect(useCase.execute(input)).rejects.toThrow("Provider timeout")

      expect(paymentRepository.update).not.toHaveBeenCalled()
      expect(outboxService.save).not.toHaveBeenCalled()
    })
  })
})
