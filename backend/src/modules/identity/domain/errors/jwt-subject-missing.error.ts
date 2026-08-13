import { DomainError } from "./domain.error.js";

export class JWTSubjectMissingError extends DomainError {
  constructor() {
    super("Jwt Subject is missing")
  }
}
