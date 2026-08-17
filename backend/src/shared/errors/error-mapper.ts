import { EmailAlreadyRegisteredError } from "../../modules/identity/domain/errors/email-already-register.error.js";
import { InvalidCredentialsError } from "../../modules/identity/domain/errors/invalid-credentials.error.js";
import { AppError } from "./AppError.js"
import { AuthenticationError } from "./AuthenticationError.js";
import { ConflictError } from "./ConflictError.js";
import { CredentialError } from "./CredentialError.js";
import { InternalServerError } from "./InternalServerError.js";

export const mapError = (error: Error, isProduction: boolean): AppError => {

  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof EmailAlreadyRegisteredError) {
    return new ConflictError(error.message, "EMAIL_ALREADY_REGISTERED")
  }

  if (error instanceof InvalidCredentialsError) {
    return new CredentialError(error.message, "INVALID_CREDENTIALS")
  }

  if (error instanceof AuthenticationError) {
    return new AuthenticationError(error.message)
  }

  return new InternalServerError(isProduction ? "An unexpected error occurred" : error.message)
}
