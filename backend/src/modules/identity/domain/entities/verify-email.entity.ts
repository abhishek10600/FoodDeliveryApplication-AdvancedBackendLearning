export class VerifyEmail {

  private readonly id: string;
  private userId: string;
  private tokenHash: string;
  private expiresAt: Date;
  private verifiedAt: Date | null;
  private readonly createdAt: Date;
  private updatedAt: Date;


  constructor(params: {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    verifiedAt: Date | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
  }) {
    this.id = params.id
    this.userId = params.userId
    this.tokenHash = params.tokenHash
    this.expiresAt = params.expiresAt
    this.verifiedAt = params.verifiedAt ?? null
    this.createdAt = params.createdAt ?? new Date()
    this.updatedAt = params.updatedAt ?? new Date()
  }

  public static create(params: {
    userId: string,
    tokenHash: string;
    expiresAt: Date
  }) {
    const now = new Date()

    return new VerifyEmail({
      id: crypto.randomUUID(),
      userId: params.userId,
      tokenHash: params.tokenHash,
      expiresAt: params.expiresAt,
      verifiedAt: null,
      createdAt: now,
      updatedAt: now
    })
  }

  public getId(): string {
    return this.id
  }

  public getUserId(): string {
    return this.userId
  }

  public getTokenHash(): string {
    return this.tokenHash
  }

  public getExpiresAt(): Date {
    return this.expiresAt
  }

  public getVerifiedAt(): Date | null {
    return this.verifiedAt
  }

  public getCreatedAt(): Date {
    return this.createdAt
  }

  public getUpdatedAt(): Date {
    return this.updatedAt
  }

  public updateVerifiedAt(verifiedAt: Date) {
    this.verifiedAt = verifiedAt

    this.touch()
  }

  private touch(): void {
    this.updatedAt = new Date()
  }

  public static rehydrate(params: {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    verifiedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return new VerifyEmail(params)
  }
}
