import { ValidationIssue } from "../validation/validation-error.js";
import { AppError } from "./AppError.js";

export class ValidationError extends AppError {
  constructor(
    public readonly details: ValidationIssue[]
  ) {
    super("Validation failed", 400, "VALIDATION_ERROR", true);
  }
}
