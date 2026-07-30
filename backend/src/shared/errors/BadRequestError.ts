import { AppError } from "./AppError.js";

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400, "BAD REQUEST");
  }
}
