import { AppError } from "./AppError.js";

export class ConflictError extends AppError {
  constructor(message: string, code = "CONFLICT") {
    super(message, 409, code, true);
  }
}
