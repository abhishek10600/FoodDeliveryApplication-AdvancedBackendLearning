import { InvalidPasswordHashError } from "../errors/index.js";
export class PasswordHash {
    static BCRYPT_REGEX = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;
    value;
    constructor(hash) {
        if (!PasswordHash.isValid(hash)) {
            throw new InvalidPasswordHashError;
        }
        this.value = hash;
    }
    static create(hash) {
        return new PasswordHash(hash);
    }
    static isValid(hash) {
        return PasswordHash.BCRYPT_REGEX.test(hash);
    }
    equals(other) {
        return this.value === other.value;
    }
    toString() {
        return this.value;
    }
    getValue() {
        return this.value;
    }
}
