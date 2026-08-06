import { AppError } from "./AppError.js";
import { ErrorResponse } from "./error-response.js";
import { ValidationError } from "./ValidationError.js";

export class ErrorSerializer {
  static serialize(error: AppError): ErrorResponse {
    const response: ErrorResponse = {
      success: false,
      error: {
        code: error.code,
        message: error.message
      }
    }

    if (error instanceof ValidationError) {
      response.error.details = error.details;
    }

    return response;
  }
}
