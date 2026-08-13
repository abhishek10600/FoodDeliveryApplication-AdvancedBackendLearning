import { AppError } from "./AppError.js";
export class AuthenticationError extends AppError {
    constructor(message = "Authentication required") {
        super(message, 401, "AUTHENTICATION_ERROR", true);
    }
}
