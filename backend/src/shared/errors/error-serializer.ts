import { AppError } from "./AppError.js";
import { ErrorResponse } from "./error-response.js";

export class ErrorSerializer {
  static serialize(error: AppError): ErrorResponse {
    return {
      success: false,

      error: {
        code: error.code,
        message: error.message
      }
    }
  }
}
