import { DomainError } from "./domain.error.js";
export class RefreshSessionExpiredError extends DomainError {
    constructor() {
        super("Refresh session has expired");
    }
}
