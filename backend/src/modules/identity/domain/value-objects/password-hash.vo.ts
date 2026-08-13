import { InvalidPasswordHashError } from "../errors/index.js";

export class PasswordHash {
  private static readonly BCRYPT_REGEX = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

  private readonly value: string;

  constructor(hash: string) {
    if (!PasswordHash.isValid(hash)) {
      throw new InvalidPasswordHashError
    }

    this.value = hash
  }

  public static create(hash: string): PasswordHash {
    return new PasswordHash(hash)
  }

  public static isValid(hash: string): boolean {
    return PasswordHash.BCRYPT_REGEX.test(hash)
  }

  public equals(other: PasswordHash): boolean {
    return this.value === other.value
  }

  public toString():string {
    return this.value
  }

  public getValue(): string {
    return this.value
  }
}
