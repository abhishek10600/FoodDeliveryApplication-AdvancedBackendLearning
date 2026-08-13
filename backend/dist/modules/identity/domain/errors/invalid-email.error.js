import { DomainError } from "./domain.error.js";
export class InvalidEmailError extends DomainError {
    constructor(email) {
        super(`'${email}' is not a valid email address.`);
    }
}
