import { DomainError } from "./domain.error.js";

export class RefreshSessionNotFound extends DomainError {
  constructor() {
    super("Refresh session not found.")
  }
}
