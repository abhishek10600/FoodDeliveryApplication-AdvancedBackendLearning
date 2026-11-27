import { injectable } from "tsyringe";
import type {PaymentProcessor,PaymentProcessorInput,PaymentProcessorResult} from "../../application/ports/payment-processor.port.js";
import { PaymentDomainError } from "../../domain/errors/payment-domain.error.js";

@injectable()
export class DummyPaymentProcessor implements PaymentProcessor {
  async process(
    input: PaymentProcessorInput
  ): Promise<PaymentProcessorResult> {
    this.validateInput(input);

    return {
      success: true,
      providerRef: `dummy_${input.paymentId}`,
    };
  }

  private validateInput(input: PaymentProcessorInput): void {
    if (!input.paymentId.trim()) {
      throw new PaymentDomainError("Payment ID is required", 400);
    }

    if (!input.orderId.trim()) {
      throw new PaymentDomainError("Order ID is required", 400);
    }

    if (
      !Number.isSafeInteger(input.amountMinor) ||
      input.amountMinor < 0
    ) {
      throw new PaymentDomainError(
        "Payment amount must be a positive safe integer",
        400
      );
    }

    if (!/^[A-Z]{3}$/.test(input.currency)) {
      throw new PaymentDomainError(
        "Currency must be a valid uppercase 3-letter code",
        400
      );
    }

    if (!input.idempotencyKey.trim()) {
      throw new PaymentDomainError("Idempotency key is required", 400);
    }
  }
}
