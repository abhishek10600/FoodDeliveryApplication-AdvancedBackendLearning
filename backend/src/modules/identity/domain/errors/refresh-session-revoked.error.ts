import { DomainError } from "./domain.error.js";

export class RefreshSessionRevoked extends DomainError {
  constructor() {
    super("Refresh session is revoked.")
  }
}
