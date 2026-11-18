import { container } from "tsyringe"
import { PaymentTokens } from "../../../modules/payment/infrastructure/persistence/tokens/payment.tokens.js"
import { PaymentRepository } from "../../../modules/payment/infrastructure/persistence/prisma/payment.repository.js"
import { PaymentProcessorTokens } from "../../../modules/payment/infrastructure/tokens/payment-processor.token.js"
import { DummyPaymentProcessor } from "../../../modules/payment/infrastructure/processors/dummy-payment.processor.js"
import { PaymentOrderReader } from "../../../modules/payment/infrastructure/persistence/prisma/payment-order-reader.repository.js"

export const registerPayment = (): void => {

  container.register(PaymentTokens.PaymentRepository, {
    useClass: PaymentRepository
  })

  container.register(PaymentTokens.PaymentOrderReader, {
    useClass: PaymentOrderReader
  })

  container.register(PaymentProcessorTokens.Processor, {
    useClass: DummyPaymentProcessor
  })

}
