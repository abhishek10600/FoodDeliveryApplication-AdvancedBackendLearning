import { AppError } from "../../../../shared/errors/AppError.js";
import { RefreshSessionExpiredError, RefreshSessionRevokedError } from "../errors/index.js";

export interface RefreshSessionProps {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  lastUsedAt: Date | null;
  revokedAt: Date | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
}


export interface CreateRefreshSessinProps {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null
}

export class RefreshSession {
  constructor(
    private readonly id: string,
    private props: RefreshSessionProps
  ) { }

  public static create(props: CreateRefreshSessinProps, id: string): RefreshSession {
    const now = new Date();

    if (!props.userId) {
      throw new AppError("Refresh session must belong to a user", 400, "USER_NOT_PROVIDED")
    }

    if (!props.tokenHash) {
      throw new AppError("Token hash missing", 400, "TOKEN_HASH_NOT_PROVIDED")
    }

    if (props.expiresAt <= now) {
      throw new AppError("Refresh session exiration must be some time in the future", 400, "INVALID_EXPIRATION_TIME")
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
    })
  }

  public static reconstitute(id: string, props: RefreshSessionProps): RefreshSession {
    return new RefreshSession(id, { ...props })
  }

  public getId(): string {
    return this.id
  }

  public getUserId(): string {
    return this.props.userId
  }

  public getTokenHash(): string {
    return this.props.tokenHash
  }

  public getExpiresAt(): Date {
    return this.props.expiresAt
  }

  public getLastUsedAt(): Date | null {
    return this.props.lastUsedAt
  }

  public getRevokedAt(): Date | null {
    return this.props.revokedAt
  }

  public getIpAddress(): string | null {
    return this.props.ipAddress
  }

  public getUserAgent(): string | null {
    return this.props.userAgent
  }

  public getCreatedAt(): Date {
    return this.props.createdAt
  }

  public getUpdatedAt(): Date {
    return this.props.updatedAt
  }

  public isExpired(now: Date = new Date()): boolean {
    return this.props.expiresAt <= now
  }

  public isRevoked(): boolean {
    return this.props.revokedAt !== null
  }

  public isActive(now: Date = new Date()): boolean {
    return !this.isExpired(now) && !this.isRevoked()
  }

  public markAsUsed(now: Date = new Date()): void {
    if (this.isRevoked()) {
      throw new RefreshSessionRevokedError()
    }

    if (this.isExpired(now)) {
      throw new RefreshSessionExpiredError()
    }

    this.props.lastUsedAt = now
    this.props.updatedAt = now
  }

  public revoke(now: Date = new Date()) {
    if (this.isRevoked()) {
      return;
    }

    this.props.revokedAt = now
    this.props.updatedAt = now
  }

}
