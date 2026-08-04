import { AppError } from "./AppError.js";

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message = "Conflict", 409, "CONFLICT", true);
  }
}
