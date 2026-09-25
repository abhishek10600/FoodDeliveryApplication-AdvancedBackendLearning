import { AppError } from "../../../../shared/errors/AppError.js"

export class RestaurantDomainError extends AppError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode, "RESTAURANT_DOMAIN_ERROR", true)
  }
}
