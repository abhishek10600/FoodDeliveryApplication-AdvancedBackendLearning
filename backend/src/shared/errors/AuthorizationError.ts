import { AppError } from "./AppError.js";

export class AuthorizationError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403, "AUTHORIZATION_ERROR", true);
  }
}
