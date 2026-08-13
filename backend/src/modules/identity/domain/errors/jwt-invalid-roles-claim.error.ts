import { DomainError } from "./domain.error.js";

export class JWTInvalidRolesClaimError extends DomainError {
  constructor() {
    super("Invalid JWT roles claim")
  }
}
