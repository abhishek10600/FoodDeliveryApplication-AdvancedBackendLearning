import { RefreshSessionExpiredError, RefreshSessionRevoked } from "../errors/index.js";

export class RefreshToken {

  private readonly tokenHash: string;
  private readonly createdAt: Date;
  private readonly expiresAt: Date;
  private readonly revokedAt: Date | null

  constructor(tokenHash: string, createdAt: Date = new Date(), expiresAt: Date, revokedAt: Date | null) {
    this.tokenHash = tokenHash
    this.createdAt = createdAt
    this.expiresAt = expiresAt
    this.revokedAt = revokedAt
  }

  public getTokenHash(): string {
    return this.tokenHash
  }

  public getCreatedAt(): Date {
    return this.createdAt
  }

  public getExpiresAt(): Date {
    return this.expiresAt
  }

  public getRevokedAt(): Date | null {
    return this.revokedAt
  }

  public isExpired(now: Date = new Date()): boolean {
    return now > this.expiresAt
  }

  public isRevoked(): boolean {
    return this.revokedAt !== null
  }

  public isUsable(now: Date = new Date()): void {
    if (this.isExpired()) {
      throw new RefreshSessionExpiredError()
    }

    if (this.isRevoked()) {
      throw new RefreshSessionRevoked()
    }
  }

  public equals(other: RefreshToken): boolean {
    return (
      this.tokenHash === other.tokenHash &&
      this.createdAt.getTime() === other.createdAt.getTime() &&
      this.expiresAt.getTime() === other.expiresAt.getTime() &&
      this.revokedAt?.getTime() === other.revokedAt?.getTime()
    )
  }
}
