import { RefreshSessionExpiredError, RefreshSessionRevokedError } from "../errors/index.js";
export class RefreshToken {
    tokenHash;
    createdAt;
    expiresAt;
    revokedAt;
    constructor(tokenHash, createdAt = new Date(), expiresAt, revokedAt) {
        this.tokenHash = tokenHash;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.revokedAt = revokedAt;
    }
    getTokenHash() {
        return this.tokenHash;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getExpiresAt() {
        return this.expiresAt;
    }
    getRevokedAt() {
        return this.revokedAt;
    }
    isExpired(now = new Date()) {
        return now > this.expiresAt;
    }
    isRevoked() {
        return this.revokedAt !== null;
    }
    isUsable(now = new Date()) {
        if (this.isExpired()) {
            throw new RefreshSessionExpiredError();
        }
        if (this.isRevoked()) {
            throw new RefreshSessionRevokedError();
        }
    }
    equals(other) {
        return (this.tokenHash === other.tokenHash &&
            this.createdAt.getTime() === other.createdAt.getTime() &&
            this.expiresAt.getTime() === other.expiresAt.getTime() &&
            this.revokedAt?.getTime() === other.revokedAt?.getTime());
    }
}
