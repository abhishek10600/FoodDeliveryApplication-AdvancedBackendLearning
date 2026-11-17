import { AppError } from "../../../../shared/errors/AppError.js";

export class PaymentDomainError extends AppError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode, "PAYMENT_DOMAIN_ERROR", true)
  }
}
