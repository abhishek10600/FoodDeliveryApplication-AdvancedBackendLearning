import { EmailAlreadyRegisteredError } from "../../modules/identity/domain/errors/email-already-register.error.js";
import { AppError } from "./AppError.js"
import { ConflictError } from "./ConflictError.js";
import { InternalServerError } from "./InternalServerError.js";

export const mapError = (error: Error, isProduction: boolean): AppError => {

  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof EmailAlreadyRegisteredError) {
    return new ConflictError(error.message, "EMAIL_ALREADY_REGISTERED")
  }

  return new InternalServerError(isProduction ? "An unexpected error occurred" : error.message)
}
