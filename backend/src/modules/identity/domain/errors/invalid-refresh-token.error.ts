import { AuthenticationError } from "../../../../shared/errors/AuthenticationError.js";

export class InvalidRefreshTokenError extends AuthenticationError {
  constructor() {
    super("Invalid refresh token.")
  }
}
