import { describe, it, expect } from "vitest";

import { PaymentProcessorInput } from "../../../src/modules/payment/application/ports/payment-processor.port"

import { DummyPaymentProcessor } from "../../../src/modules/payment/infrastructure/processors/dummy-payment.processor"

const createInput = (
  overrides: Partial<PaymentProcessorInput> = {},
): PaymentProcessorInput => ({
  paymentId: "550e8400-e29b-41d4-a716-446655440000",
  orderId: "550e8400-e29b-41d4-a716-446655440001",
  amountMinor: 10500,
  currency: "INR",
  idempotencyKey: "payment-order-001",
  ...overrides,
});

describe("DummyPaymentProcessor", () => {
  it("should process a successful payment", async () => {
    const processor = new DummyPaymentProcessor();

    const result = await processor.process(createInput());

    expect(result).toEqual({
      success: true,
      providerRef:
        "dummy_550e8400-e29b-41d4-a716-446655440000",
    });
  });

  it("should simulate a declined payment", async () => {
    const processor = new DummyPaymentProcessor(() => true);

    const result = await processor.process(createInput());

    expect(result).toEqual({
      success: false,
      failureCode: "DUMMY_PAYMENT_DECLINED",
      failureMessage:
        "Dummy payment provider declined this payment",
    });
  });

//   it("should validate the payment amount", async () => {
//     const processor = new DummyPaymentProcessor();
//
//     await expect(
//       processor.process(createInput({ amountMinor: 0 })),
//     ).rejects.toThrow("Payment amount must be a positive safe integer.");
//   });

  it("should reject negative payment amounts", async () => {
    const processor = new DummyPaymentProcessor();

    await expect(
      processor.process(createInput({ amountMinor: -100 })),
    ).rejects.toThrow();
  });

  it("should reject invalid currency", async () => {
    const processor = new DummyPaymentProcessor();

    await expect(
      processor.process(createInput({ currency: "inr" })),
    ).rejects.toThrow("Currency must be a valid uppercase 3-letter code.");
  });

  it("should reject a missing payment ID", async () => {
    const processor = new DummyPaymentProcessor();

    await expect(
      processor.process(createInput({ paymentId: "" })),
    ).rejects.toThrow("Payment ID is required");
  });

  it("should reject a missing idempotency key", async () => {
    const processor = new DummyPaymentProcessor();

    await expect(
      processor.process(createInput({ idempotencyKey: "" })),
    ).rejects.toThrow("IdempotencyKey is required");
  });
});
