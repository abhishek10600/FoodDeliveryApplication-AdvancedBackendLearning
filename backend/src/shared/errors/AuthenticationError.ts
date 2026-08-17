import { AppError } from "./AppError.js";

export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message, 401, "AUTHENTICATION_ERROR", true);
  }
}
