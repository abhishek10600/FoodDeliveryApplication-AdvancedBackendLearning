import { DomainError } from "./domain.error.js";

export class InvalidEmailError extends DomainError {
  constructor(email: string) {
    super(`'${email}' is not a valid email address.`)
  }
}
