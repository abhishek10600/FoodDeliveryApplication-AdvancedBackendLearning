import { AppError } from "../../../../shared/errors/AppError.js";

export class AddressDomainError extends AppError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode, "ADDRESS_DOMAIN_ERROR", true)
  }
}
