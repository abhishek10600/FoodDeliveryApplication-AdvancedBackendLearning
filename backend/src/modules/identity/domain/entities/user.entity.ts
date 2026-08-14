import { Role, UserStatus } from "../enums/index.js";
import { DuplicateRoleError, EmailAlreadyVerifiedError, RoleNotAssignedError } from "../errors/index.js";
import { Email, PasswordHash } from "../value-objects/index.js";

export class User {

  private readonly id: string;
  private email: Email;
  private passwordHash: PasswordHash;
  private readonly roles: Set<Role>;
  private status: UserStatus;
  private emailVerified: boolean;
  private readonly createdAt: Date;
  private updatedAt: Date

  constructor(params: {
    id: string;
    email: Email;
    passwordHash: PasswordHash;
    roles: Iterable<Role>;
    status: UserStatus;
    emailVerified: boolean;
    createdAt: Date
    updatedAt: Date
  }) {
    this.id = params.id;
    this.email = params.email;
    this.passwordHash = params.passwordHash;
    this.roles = new Set(params.roles ?? [Role.CUSTOMER]);
    this.status = params.status ?? UserStatus.ACTIVE;
    this.emailVerified = params.emailVerified ?? false;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date()
  }

  public static create(params: {
    email: Email;
    passwordHash: PasswordHash;
  }): User {
    const now = new Date();

    return new User({
      id: crypto.randomUUID(),
      email: params.email,
      passwordHash: params.passwordHash,
      roles: [Role.CUSTOMER],
      status: UserStatus.ACTIVE,
      emailVerified: false,
      createdAt: now,
      updatedAt: now
    })
  }

  public static rehydrate(params: {
    id: string;
    email: Email;
    passwordHash: PasswordHash;
    roles: Iterable<Role>;
    status: UserStatus;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(params)
  }

  public getId(): string {
    return this.id
  }

  public getEmail(): Email {
    return this.email
  }

  public getPasswordHash(): PasswordHash {
    return this.passwordHash
  }

  public getRoles(): Role[] {
    return [...this.roles]
  }

  public getStatus(): UserStatus {
    return this.status
  }

  public isEmailVerified(): boolean {
    return this.emailVerified
  }

  public getCreatedAt(): Date {
    return this.createdAt
  }

  public getUpdatedAt(): Date {
    return this.updatedAt
  }

  public changePassword(passwordHash: PasswordHash) {
    this.passwordHash = passwordHash

    this.touch()
  }

  public assignRole(role: Role): void {
    if (this.roles.has(role)) {
      throw new DuplicateRoleError(role)
    }

    this.roles.add(role)

    this.touch()
  }

  public removeRole(role: Role): void {
    if (!this.roles.has(role)) {
      throw new RoleNotAssignedError(role)
    }

    this.roles.delete(role)

    this.touch()
  }

  public hasRole(role: Role): boolean {
    return this.roles.has(role)
  }

  public verifyEmail(): void {
    if (this.emailVerified) {
      throw new EmailAlreadyVerifiedError()
    }

    this.emailVerified = true;

    this.touch()
  }

  public activate(): void {
    this.status = UserStatus.ACTIVE

    this.touch()
  }

  public deactivate(): void {
    this.status = UserStatus.INACTIVE

    this.touch()
  }

  public suspend(): void {
    this.status = UserStatus.SUSPENDED

    this.touch()
  }

  private touch(): void {
    this.updatedAt = new Date()
  }
}
