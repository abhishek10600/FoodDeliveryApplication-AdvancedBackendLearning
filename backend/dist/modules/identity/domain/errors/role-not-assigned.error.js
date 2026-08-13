import { DomainError } from "./domain.error.js";
export class RoleNotAssignedError extends DomainError {
    constructor(role) {
        super(`${role} is not assigned.`);
    }
}
