import { InvalidEmailError } from "../errors/index.js";
export class Email {
    static EMAIL_REGEX = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;
    value;
    constructor(email) {
        const normalized = Email.normalize(email);
        if (!Email.isValid(normalized)) {
            throw new InvalidEmailError(email);
        }
        this.value = normalized;
    }
    static create(email) {
        return new Email(email);
    }
    static isValid(email) {
        return Email.EMAIL_REGEX.test(email);
    }
    static normalize(email) {
        return email.trim().toLocaleLowerCase();
    }
    equals(other) {
        return this.value === other.value;
    }
    getValue() {
        return this.value;
    }
}
