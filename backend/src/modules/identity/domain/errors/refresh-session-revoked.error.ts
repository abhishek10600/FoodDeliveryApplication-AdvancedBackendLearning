import { DomainError } from "./domain.error.js";

export class RefreshSessionRevokedError extends DomainError {
  constructor() {
    super("Refresh session is revoked.")
  }
}
