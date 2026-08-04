import { AppError } from "./AppError.js";

export class InternalServerError extends AppError {
  constructor(message: string) {
    super(message = "Internal server error", 500, "INTERNAL_SERVER_ERROR", true);
  }
}
