import { AppError } from "./AppError.js";

export class CredentialError extends AppError {
  constructor(message: string, code = "INVALID_CREDENTIALS") {
    super(message, 409, code, true);
  }
}
