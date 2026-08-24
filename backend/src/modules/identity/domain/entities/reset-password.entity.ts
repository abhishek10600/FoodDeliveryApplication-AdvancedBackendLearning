export class ResetPasswordEntity {

  private readonly id: string;
  private userId: string;
  private tokenHash: string;
  private expiresAt: Date;
  private usedAt: Date | null;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(params: {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    usedAt: Date | null;
    createdAt: Date;
    updatedAt: Date
  }) {

    this.id = params.id
    this.userId = params.userId
    this.tokenHash = params.tokenHash
    this.expiresAt = params.expiresAt
    this.usedAt = params.usedAt ?? null
    this.createdAt = params.createdAt ?? new Date
    this.updatedAt = params.updatedAt ?? new Date
  }

  public static create(params: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }) {
    const now = new Date()

    return new ResetPasswordEntity({
      id: crypto.randomUUID(),
      userId: params.userId,
      tokenHash: params.tokenHash,
      expiresAt: params.expiresAt,
      usedAt: null,
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

  public getUsedAt(): Date | null {
    return this.usedAt
  }

  public getCreatedAt(): Date {
    return this.createdAt
  }

  public getUpdatedAt(): Date {
    return this.updatedAt
  }

  public updateUsedAt(usedAt: Date): void {
    this.usedAt = usedAt

    this.touch()
  }

  private touch(): void {
    this.updatedAt = new Date()
  }

  public static rehydrate(params: {
    id: string,
    userId: string,
    tokenHash: string,
    expiresAt: Date,
    usedAt: Date | null,
    createdAt: Date,
    updatedAt: Date
  }) {
    return new ResetPasswordEntity(params)
  }
}
