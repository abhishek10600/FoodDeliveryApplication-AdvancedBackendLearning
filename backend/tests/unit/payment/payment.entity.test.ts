import { describe, it, expect } from "vitest"

import { Payment } from "../../../src/modules/payment/domain/entities/payment.entity.js"
import { PaymentStatus } from "../../../src/modules/payment/domain/enums/payment-status.enum.js"
import { PaymentProvider } from "../../../src/modules/payment/domain/enums/payment-provider.enum.js"
import { PaymentDomainError } from "../../../src/modules/payment/domain/errors/payment-domain.error.js"

describe("Payment Entity", () => {
  const createPayment = () =>
    Payment.create({
      orderId: crypto.randomUUID(),
      provider: PaymentProvider.DUMMY,
      status: PaymentStatus.PENDING,
      amount: 250,
      currency: "INR",
      idempotencyKey: crypto.randomUUID(),
      createdAt: new Date()
    })

  describe("creation", () => {
    it("should create a payment with PENDING status", () => {
      const payment = createPayment()

      expect(payment.getStatus()).toBe(PaymentStatus.PENDING)
      expect(payment.getAmount()).toBe(250)
      expect(payment.getCurrency()).toBe("INR")
      expect(payment.getProvider()).toBe(PaymentProvider.DUMMY)
    })

    it("should generate a unique payment ID", () => {
      const payment1 = createPayment()
      const payment2 = createPayment()

      expect(payment1.getId()).not.toBe(payment2.getId())
    })

    it("should initialize provider reference and failure details as null", () => {
      const payment = createPayment()

      expect(payment.getProviderRef()).toBeNull()
      expect(payment.getFailureCode()).toBeNull()
      expect(payment.getFailureMessage()).toBeNull()
      expect(payment.getProcessedAt()).toBeNull()
    })
  })

  describe("state transitions", () => {
    it("should transition from PENDING to PROCESSING", () => {
      const payment = createPayment()

      payment.markProcessing()

      expect(payment.getStatus()).toBe(PaymentStatus.PROCESSING)
    })

    it("should transition from PROCESSING to SUCCEEDED", () => {
      const payment = createPayment()

      payment.markProcessing()
      payment.markSucceeded("dummy-reference-123")

      expect(payment.getStatus()).toBe(PaymentStatus.SUCCEEDED)
      expect(payment.getProviderRef()).toBe("dummy-reference-123")
      expect(payment.getProcessedAt()).toBeInstanceOf(Date)
    })

    it("should transition from PROCESSING to FAILED", () => {
      const payment = createPayment()

      payment.markProcessing()
      payment.markFailed(
        "DUMMY_PAYMENT_DECLINED",
        "Payment was declined"
      )

      expect(payment.getStatus()).toBe(PaymentStatus.FAILED)
      expect(payment.getFailureCode()).toBe("DUMMY_PAYMENT_DECLINED")
      expect(payment.getFailureMessage()).toBe("Payment was declined")
      expect(payment.getProcessedAt()).toBeInstanceOf(Date)
    })

    it("should transition from PENDING to CANCELLED", () => {
      const payment = createPayment()

      payment.cancel()

      expect(payment.getStatus()).toBe(PaymentStatus.CANCELLED)
    })
  })

  describe("invalid transitions", () => {
    it("should not allow PENDING to SUCCEEDED", () => {
      const payment = createPayment()

      expect(() => {
        payment.markSucceeded("provider-ref")
      }).toThrow(PaymentDomainError)
    })

    it("should not allow PENDING to FAILED", () => {
      const payment = createPayment()

      expect(() => {
        payment.markFailed("DECLINED", "Declined")
      }).toThrow(PaymentDomainError)
    })

    it("should not allow PROCESSING to PROCESSING", () => {
      const payment = createPayment()

      payment.markProcessing()

      expect(() => {
        payment.markProcessing()
      }).toThrow(PaymentDomainError)
    })

    it("should not allow SUCCEEDED to become FAILED", () => {
      const payment = createPayment()

      payment.markProcessing()
      payment.markSucceeded("provider-ref")

      expect(() => {
        payment.markFailed("DECLINED", "Declined")
      }).toThrow(PaymentDomainError)
    })

    it("should not allow FAILED to become SUCCEEDED", () => {
      const payment = createPayment()

      payment.markProcessing()
      payment.markFailed("DECLINED", "Declined")

      expect(() => {
        payment.markSucceeded("provider-ref")
      }).toThrow(PaymentDomainError)
    })

    it("should not allow CANCELLED to become PROCESSING", () => {
      const payment = createPayment()

      payment.cancel()

      expect(() => {
        payment.markProcessing()
      }).toThrow(PaymentDomainError)
    })
  })

  describe("domain validation", () => {
    it("should reject an empty provider reference", () => {
      const payment = createPayment()

      payment.markProcessing()

      expect(() => {
        payment.markSucceeded(" ")
      }).toThrow(PaymentDomainError)
    })

    it("should reject an empty failure code", () => {
      const payment = createPayment()

      payment.markProcessing()

      expect(() => {
        payment.markFailed("", "Failure message is required to mark a payment as FAILED")
      }).toThrow(PaymentDomainError)
    })

    it("should reject an empty failure message", () => {
      const payment = createPayment()

      payment.markProcessing()

      expect(() => {
        payment.markFailed("DECLINED", " ")
      }).toThrow(PaymentDomainError)
    })
  })
})
