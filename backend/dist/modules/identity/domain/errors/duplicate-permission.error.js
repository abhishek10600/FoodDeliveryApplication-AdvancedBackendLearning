import { DomainError } from "./domain.error.js";
export class DuplicatePermissionError extends DomainError {
    constructor(permission) {
        super(`Permission '${permission}' already exists.`);
    }
}
