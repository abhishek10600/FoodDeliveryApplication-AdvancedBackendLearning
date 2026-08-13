import { AppError } from "./AppError.js";

export class NotFoundError extends AppError {
  constructor(message: string = "Resource Not Found") {
    super(message, 404, "NOT FOUND", true);
  }
}
