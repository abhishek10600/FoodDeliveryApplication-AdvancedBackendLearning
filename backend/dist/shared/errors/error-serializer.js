import { ValidationError } from "./ValidationError.js";
export class ErrorSerializer {
    static serialize(error) {
        const response = {
            success: false,
            error: {
                code: error.code,
                message: error.message
            }
        };
        if (error instanceof ValidationError) {
            response.error.details = error.details;
        }
        return response;
    }
}
