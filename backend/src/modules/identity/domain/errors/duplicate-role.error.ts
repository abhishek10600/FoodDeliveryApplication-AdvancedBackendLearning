import { DomainError } from "./domain.error.js";

export class DuplicateRoleError extends DomainError {
  constructor(role: string) {
    super(`User already has the '${role} role.'`)
  }
}
