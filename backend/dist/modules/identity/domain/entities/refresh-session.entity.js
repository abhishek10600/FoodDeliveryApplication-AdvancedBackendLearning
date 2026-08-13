import { AppError } from "../../../../shared/errors/AppError.js";
import { RefreshSessionExpiredError, RefreshSessionRevokedError } from "../errors/index.js";
export class RefreshSession {
    id;
    props;
    constructor(id, props) {
        this.id = id;
        this.props = props;
    }
    static create(props, id) {
        const now = new Date();
        if (!props.userId) {
            throw new AppError("Refresh session must belong to a user", 400, "USER_NOT_PROVIDED");
        }
        if (!props.tokenHash) {
            throw new AppError("Token hash missing", 400, "TOKEN_HASH_NOT_PROVIDED");
        }
        if (props.expiresAt <= now) {
            throw new AppError("Refresh session exiration must be some time in the future", 400, "INVALID_EXPIRATION_TIME");
        }
        return new RefreshSession(id, {
            userId: props.userId,
            tokenHash: props.tokenHash,
            expiresAt: props.expiresAt,
            lastUsedAt: null,
            revokedAt: null,
            ipAddress: props.ipAddress ?? null,
            userAgent: props.userAgent ?? null,
            createdAt: now,
            updatedAt: now
        });
    }
    static reconstitute(id, props) {
        return new RefreshSession(id, { ...props });
    }
    getId() {
        return this.id;
    }
    getUserId() {
        return this.props.userId;
    }
    getTokenHash() {
        return this.props.tokenHash;
    }
    getExpiresAt() {
        return this.props.expiresAt;
    }
    getLastUsedAt() {
        return this.props.lastUsedAt;
    }
    getRevokedAt() {
        return this.props.revokedAt;
    }
    getIpAddress() {
        return this.props.ipAddress;
    }
    getUserAgent() {
        return this.props.userAgent;
    }
    getCreatedAt() {
        return this.props.createdAt;
    }
    getUpdatedAt() {
        return this.props.updatedAt;
    }
    isExpired(now = new Date()) {
        return this.props.expiresAt <= now;
    }
    isRevoked() {
        return this.props.revokedAt !== null;
    }
    isActive(now = new Date()) {
        return !this.isExpired(now) && !this.isRevoked();
    }
    markAsUsed(now = new Date()) {
        if (this.isRevoked()) {
            throw new RefreshSessionRevokedError();
        }
        if (this.isExpired(now)) {
            throw new RefreshSessionExpiredError();
        }
        this.props.lastUsedAt = now;
        this.props.updatedAt = now;
    }
    revoke(now = new Date()) {
        if (this.isRevoked()) {
            return;
        }
        this.props.revokedAt = now;
        this.props.updatedAt = now;
    }
}
