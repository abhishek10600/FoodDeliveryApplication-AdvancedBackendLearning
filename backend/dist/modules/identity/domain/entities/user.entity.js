import { Role, UserStatus } from "../enums/index.js";
import { DuplicateRoleError, EmailAlreadyVerifiedError, RoleNotAssignedError } from "../errors/index.js";
export class User {
    id;
    email;
    passwordHash;
    roles;
    status;
    emailVerified;
    createdAt;
    updatedAt;
    constructor(params) {
        this.id = params.id;
        this.email = params.email;
        this.passwordHash = params.passwordHash;
        this.roles = new Set(params.roles ?? [Role.CUSTOMER]);
        this.status = params.status ?? UserStatus.ACTIVE;
        this.emailVerified = params.emailVerified ?? false;
        this.createdAt = params.createdAt ?? new Date();
        this.updatedAt = params.updatedAt ?? new Date();
    }
    getId() {
        return this.id;
    }
    getEmail() {
        return this.email;
    }
    getPasswordHash() {
        return this.passwordHash;
    }
    getRoles() {
        return [...this.roles];
    }
    getStatus() {
        return this.status;
    }
    isEmailVerified() {
        return this.emailVerified;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
    changePassword(passwordHash) {
        this.passwordHash = passwordHash;
        this.touch();
    }
    assignRole(role) {
        if (this.roles.has(role)) {
            throw new DuplicateRoleError(role);
        }
        this.roles.add(role);
        this.touch();
    }
    removeRole(role) {
        if (!this.roles.has(role)) {
            throw new RoleNotAssignedError(role);
        }
        this.roles.delete(role);
        this.touch();
    }
    hasRole(role) {
        return this.roles.has(role);
    }
    verifyEmail() {
        if (this.emailVerified) {
            throw new EmailAlreadyVerifiedError();
        }
        this.emailVerified = true;
        this.touch();
    }
    activate() {
        this.status = UserStatus.ACTIVE;
        this.touch();
    }
    deactivate() {
        this.status = UserStatus.INACTIVE;
        this.touch();
    }
    suspend() {
        this.status = UserStatus.SUSPENDED;
        this.touch();
    }
    touch() {
        this.updatedAt = new Date();
    }
}
