import { injectable } from "tsyringe"
import { type DummyPaymentFailurePolicy, PaymentProcessor, PaymentProcessorInput, PaymentProcessorResult } from "../../application/ports/payment-processor.port.js";
import { PaymentDomainError } from "../../domain/errors/payment-domain.error.js";

@injectable()
export class DummyPaymentProcessor implements PaymentProcessor {

  constructor(

    private readonly shouldFail: DummyPaymentFailurePolicy = ()=> false

  ) { }

  async process(input: PaymentProcessorInput): Promise<PaymentProcessorResult> {
    this.validateInput(input)

    if (this.shouldFail(input)) {
      return {
        success: false,
        failureCode: "DUMMY_PAYMENT_DECLINED",
        failureMessage: "Dummy payment provider declined this payment"
      }
    }

    return {
      success: true,
      providerRef: `dummy_${input.paymentId}`
    }

  }

  private validateInput(input: PaymentProcessorInput): void {

    if (!input.paymentId.trim()) {
      throw new PaymentDomainError("Payment ID is required", 400)
    }

    if (!input.orderId.trim()) {
      throw new PaymentDomainError("Order Id is required", 400)
    }

    if (!Number.isSafeInteger(input.amountMinor) || input.amountMinor < 0) {
      throw new PaymentDomainError("Payment amount must be a positive safe integer", 400)
    }

    if (!/^[A-Z]{3}$/.test(input.currency)) {
      throw new Error("Currency must be a valid uppercase 3-letter code.");
    }

    if (!input.idempotencyKey.trim()) {
      throw new PaymentDomainError("IdempotencyKey is required", 400)
    }
  }

}
