import { AppError } from "./AppError.js";
export class InternalServerError extends AppError {
    constructor(message = "Internal server error") {
        super(message, 500, "INTERNAL_SERVER_ERROR", true);
    }
}
