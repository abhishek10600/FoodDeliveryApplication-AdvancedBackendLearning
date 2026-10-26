import { AppError } from "../../../../shared/errors/AppError.js";

export class DriverDomainError extends AppError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode, "DRIVE_DOMAIN_ERROR", true)
  }
}
