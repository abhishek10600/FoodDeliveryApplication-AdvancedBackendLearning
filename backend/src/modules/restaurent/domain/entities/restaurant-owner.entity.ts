import { Role } from "../../../identity/domain/enums/role.enum.js";
import { UserStatus } from "../../../identity/domain/enums/user-status.enum.js";
import { Email } from "../../../identity/domain/value-objects/email.vo.js";
import { PasswordHash } from "../../../identity/domain/value-objects/password-hash.vo.js";

export class RestaurantOwner {

  private readonly id: string;
  private email: Email;
  private passwordHash: PasswordHash;
  private readonly roles: Set<Role>;
  private status: UserStatus;
  private emailVerified: boolean;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(props: {
    id: string;
    email: Email;
    passwordHash: PasswordHash;
    roles: Iterable<Role>;
    status: UserStatus;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.roles = new Set(props.roles ?? [Role.RESTAURANT_OWNER]);
    this.status = props.status;
    this.emailVerified = props.emailVerified;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static create(props: {
    email: Email;
    passwordHash: PasswordHash;
  }): RestaurantOwner {

    const now = new Date();

    return new RestaurantOwner({
      id: crypto.randomUUID(),
      email: props.email,
      passwordHash: props.passwordHash,
      roles: [Role.RESTAURANT_OWNER],
      status: UserStatus.ACTIVE,
      emailVerified: false,
      createdAt: now,
      updatedAt: now
    })

  }

  public static rehydrate(props: {
    id: string;
    email: Email;
    passwordHash: PasswordHash;
    roles: Iterable<Role>;
    status: UserStatus;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date
  }): RestaurantOwner {
    return new RestaurantOwner(props)
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

  // private touch(): void {
  //   this.updatedAt = new Date
  // }


}
