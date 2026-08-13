import { DomainError } from "./domain.error.js";
export class InvalidPasswordHashError extends DomainError {
    constructor() {
        super("The provided password hash is invalid");
    }
}
