import { AuthenticationError } from "../../../../shared/errors/AuthenticationError.js";

export class RefreshSessionNotFound extends AuthenticationError {
  constructor() {
    super("Refresh session not found.")
  }
}
