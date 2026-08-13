import { AppError } from "./AppError.js";
export class AuthorizationError extends AppError {
    constructor(message = "Forbidden") {
        super(message, 403, "AUTHORIZATION_ERROR", true);
    }
}
