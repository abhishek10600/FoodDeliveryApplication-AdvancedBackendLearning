import { AppError } from "./AppError.js";

export class ServiceUnavailableError extends AppError {
  constructor(message: string) {
    super(message, 503, "SERVICE UNAVAILABLE");
  }
}
