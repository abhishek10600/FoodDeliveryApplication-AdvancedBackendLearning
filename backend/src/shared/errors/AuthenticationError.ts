import { AppError } from "./AppError.js";

export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message = "Authentication required", 401, "AUTHENTICATION_ERROR", true);
  }
}
