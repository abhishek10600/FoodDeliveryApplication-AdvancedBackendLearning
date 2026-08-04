import { AppError } from "./AppError.js";

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message = "Resource Not Found", 404, "NOT FOUND", true);
  }
}
