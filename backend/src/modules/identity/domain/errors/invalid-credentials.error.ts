import { DomainError } from "./domain.error.js";

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super("Invalid credentials")
  }
}
