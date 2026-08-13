import { AppError } from "./AppError.js";
export class ValidationError extends AppError {
    details;
    constructor(details) {
        super("Validation failed", 400, "VALIDATION_ERROR", true);
        this.details = details;
    }
}
