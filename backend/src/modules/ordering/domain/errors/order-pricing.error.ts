import { AppError } from "../../../../shared/errors/AppError.js";

export class OrderPricingError extends AppError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode, "ORDER_PRICING_ERROR")
  }
}
