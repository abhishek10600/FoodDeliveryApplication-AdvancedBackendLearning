import { DomainError } from "./domain.error.js";

export class JWTInvalidTokenTypeError extends DomainError {
  constructor() {
    super("Invalid JWT token type.")
  }
}
