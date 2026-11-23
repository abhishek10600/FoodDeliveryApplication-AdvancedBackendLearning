import { AppError } from "../../../../shared/errors/AppError.js";

export class OrderDomainError extends AppError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode, "ORDER_DOMAIN_ERROR")
  }
}
