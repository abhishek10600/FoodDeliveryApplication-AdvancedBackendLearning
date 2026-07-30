import { AppError } from "./AppError.js";

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, "NOT FOUND");
  }
}
