import { AppError } from "./AppError.js";

export class ServiceUnavailableError extends AppError {
  constructor(message: string = "Service temporarily unavailable") {
    super(message, 503, "SERVICE_UNAVAILABLE", true);
  }
}
