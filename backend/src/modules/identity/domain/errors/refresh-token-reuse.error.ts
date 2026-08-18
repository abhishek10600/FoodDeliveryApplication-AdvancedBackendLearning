import { AuthenticationError } from "../../../../shared/errors/AuthenticationError.js";

export class RefreshTokenReuseError extends AuthenticationError {
  constructor() {
    super("Refresh token reuse detected.")
  }
}
