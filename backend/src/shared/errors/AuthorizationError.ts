import { AppError } from "./AppError.js";

export class AuthorizationError extends AppError {
  constructor(message: string) {
    super(message = "Forbidden", 403, "AUTHORIZATION_ERROR", true);
  }
}
