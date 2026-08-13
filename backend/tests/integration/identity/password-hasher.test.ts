import { describe, expect, it } from "vitest";

import { BcryptPasswordHasher } from "../../../src/modules/identity/infrastructure/security/bcrypt-password-hasher.js";

import { PasswordHash } from "../../../src/modules/identity/domain/value-objects/password-hash.vo.js";

describe("BcryptPasswordHasher", () => {

  const passwordHasher = new BcryptPasswordHasher();

  it("should hash a password", async () => {

    const password = "StrongPassword123!";

    const passwordHash = await passwordHasher.hashPassword(password);

    expect(passwordHash).toBeInstanceOf(PasswordHash);
    expect(passwordHash.getValue()).not.toBe(password);
    expect(PasswordHash.isValid(passwordHash.getValue())).toBe(true);

  });

  it("should generate different hashes for the same password", async () => {

    const password = "StrongPassword123!";

    const hash1 = await passwordHasher.hashPassword(password);
    const hash2 = await passwordHasher.hashPassword(password);

    expect(hash1.getValue()).not.toBe(hash2.getValue());

  });

  it("should return true for the correct password", async () => {

    const password = "StrongPassword123!";

    const passwordHash = await passwordHasher.hashPassword(password);

    const result = await passwordHasher.comparePassword(
      password,
      passwordHash
    );

    expect(result).toBe(true);

  });

  it("should return false for the incorrect password", async () => {

    const password = "StrongPassword123!";
    const wrongPassword = "WrongPassword123!";

    const passwordHash = await passwordHasher.hashPassword(password);

    const result = await passwordHasher.comparePassword(
      wrongPassword,
      passwordHash
    );

    expect(result).toBe(false);

  });

});
