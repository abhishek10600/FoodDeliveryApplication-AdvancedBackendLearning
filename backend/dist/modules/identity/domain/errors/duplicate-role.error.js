import { DomainError } from "./domain.error.js";
export class DuplicateRoleError extends DomainError {
    constructor(role) {
        super(`User already has the '${role} role.'`);
    }
}
