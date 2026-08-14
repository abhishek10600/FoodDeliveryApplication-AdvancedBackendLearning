import { DomainError } from "./domain.error.js";

export class EmailAlreadyRegisteredError extends DomainError {
  constructor() {
    super(`User with this email already exists.`)
  }
}
