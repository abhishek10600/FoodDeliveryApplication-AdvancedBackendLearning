import { container } from "tsyringe"
import { PaymentTokens } from "../../../modules/payment/infrastructure/persistence/tokens/payment.tokens.js"
import { PaymentRepository } from "../../../modules/payment/infrastructure/persistence/prisma/payment.repository.js"

export const registerPayment = (): void => {

  container.register(PaymentTokens.PaymentRepository, {
    useClass: PaymentRepository
  })

}
