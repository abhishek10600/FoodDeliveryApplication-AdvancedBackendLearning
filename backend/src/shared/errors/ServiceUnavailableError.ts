import { AppError } from "./AppError.js";

export class ServiceUnavailableError extends AppError {
  constructor(message: string) {
    super(message = "Service temporarily unavailable", 503, "SERVICE_UNAVAILABLE", true);
  }
}
