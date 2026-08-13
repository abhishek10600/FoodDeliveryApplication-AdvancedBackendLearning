import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client.js";

import { UserRepository } from "../../../src/modules/identity/infrastructure/persistence/prisma/user.repository.js";

import { User } from "../../../src/modules/identity/domain/entities/index.js";
import { Role, UserStatus } from "../../../src/modules/identity/domain/enums/index.js";

import {
  Email,
  PasswordHash,
} from "../../../src/modules/identity/domain/value-objects/index.js";

import { createTestUser, buildTestUser } from "../../factories/index.js";

describe("UserRepository Integration Tests", () => {
  let prisma: PrismaClient;
  let repository: UserRepository;

  // =========================================================
  // SETUP
  // =========================================================

  beforeAll(async () => {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });

    prisma = new PrismaClient({
      adapter,
    });

    await prisma.$connect();

    repository = new UserRepository(prisma);
  });

  beforeEach(async () => {
    /*
     * User is the parent of RefreshSession.
     *
     * Refresh sessions must be deleted first.
     *
     * This is important because these integration tests
     * run against the real PostgreSQL database.
     */
    await prisma.refreshSession.deleteMany();

    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.refreshSession.deleteMany();

    await prisma.user.deleteMany();

    await prisma.$disconnect();
  });

  // =========================================================
  // CREATE
  // =========================================================

  describe("create()", () => {
    it("should create a user in the database", async () => {
      /*
       * buildTestUser() only creates the domain entity.
       *
       * The repository is responsible for persistence,
       * so this is the correct factory for this test.
       */
      const user = buildTestUser({
        email: "create@example.com",
      });

      const createdUser = await repository.create(user);

      // -----------------------------------------------------
      // Domain object
      // -----------------------------------------------------

      expect(createdUser).toBeInstanceOf(User);

      expect(createdUser.getId()).toBe(
        user.getId(),
      );

      expect(
        createdUser.getEmail().getValue(),
      ).toBe("create@example.com");

      expect(
        createdUser.getPasswordHash().getValue(),
      ).toBe(
        user.getPasswordHash().getValue(),
      );

      expect(
        createdUser.getRoles(),
      ).toEqual([Role.CUSTOMER]);

      expect(
        createdUser.getStatus(),
      ).toBe(UserStatus.ACTIVE);

      expect(
        createdUser.isEmailVerified(),
      ).toBe(false);

      // -----------------------------------------------------
      // Database
      // -----------------------------------------------------

      const databaseUser =
        await prisma.user.findUnique({
          where: {
            id: user.getId(),
          },
        });

      expect(databaseUser).not.toBeNull();

      expect(databaseUser?.id).toBe(
        user.getId(),
      );

      expect(databaseUser?.email).toBe(
        "create@example.com",
      );

      expect(databaseUser?.passwordHash).toBe(
        user.getPasswordHash().getValue(),
      );

      expect(databaseUser?.roles).toEqual([
        Role.CUSTOMER,
      ]);

      expect(databaseUser?.status).toBe(
        UserStatus.ACTIVE,
      );

      expect(databaseUser?.emailVerified).toBe(false);
    });
  });

  // =========================================================
  // FIND BY ID
  // =========================================================

  describe("findById()", () => {
    it("should return the user when the id exists", async () => {
      /*
       * The user must already exist in the database.
       *
       * We use createTestUser() because this test is about
       * findById(), not create().
       */
      const user = await createTestUser(
        prisma,
        {
          email: "find-by-id@example.com",
        },
      );

      const foundUser =
        await repository.findById(
          user.getId(),
        );

      expect(foundUser).not.toBeNull();

      expect(foundUser).toBeInstanceOf(User);

      expect(foundUser?.getId()).toBe(
        user.getId(),
      );

      expect(
        foundUser?.getEmail().getValue(),
      ).toBe(
        "find-by-id@example.com",
      );
    });

    it("should return null when the user does not exist", async () => {
      const result =
        await repository.findById(
          crypto.randomUUID(),
        );

      expect(result).toBeNull();
    });
  });

  // =========================================================
  // FIND BY EMAIL
  // =========================================================

  describe("findByEmail()", () => {
    it("should return the user when the email exists", async () => {
      const email =
        "find-by-email@example.com";

      const user = await createTestUser(
        prisma,
        {
          email,
        },
      );

      const foundUser =
        await repository.findByEmail(
          Email.create(email),
        );

      expect(foundUser).not.toBeNull();

      expect(foundUser).toBeInstanceOf(User);

      expect(foundUser?.getId()).toBe(
        user.getId(),
      );

      expect(
        foundUser?.getEmail().getValue(),
      ).toBe(email);
    });

    it("should return null when the email does not exist", async () => {
      const email =
        "does-not-exist@example.com";

      const result =
        await repository.findByEmail(
          Email.create(email),
        );

      expect(result).toBeNull();
    });
  });

  // =========================================================
  // EXISTS BY EMAIL
  // =========================================================

  describe("existsByEmail()", () => {
    it("should return true when the email exists", async () => {
      const email =
        "exists@example.com";

      await createTestUser(
        prisma,
        {
          email,
        },
      );

      const exists =
        await repository.existsByEmail(
          Email.create(email),
        );

      expect(exists).toBe(true);
    });

    it("should return false when the email does not exist", async () => {
      const exists =
        await repository.existsByEmail(
          Email.create(
            "missing@example.com",
          ),
        );

      expect(exists).toBe(false);
    });
  });

  // =========================================================
  // UPDATE
  // =========================================================

  describe("update()", () => {
    it("should update an existing user", async () => {
      /*
       * We create the initial database state using the
       * factory, then mutate the domain entity and use
       * the repository to persist the update.
       */
      const user = await createTestUser(
        prisma,
        {
          email: "update@example.com",
        },
      );

      user.changePassword(
        PasswordHash.create(
          "$2b$10$6bF7f8j3pL0u2z3m4n5o6u8R7S6T5U4V3W2X1Y0Z9A8B7C6D5E4F3",
        ),
      );

      user.verifyEmail();

      user.assignRole(Role.DRIVER);

      user.suspend();

      const updatedUser =
        await repository.update(user);

      // -----------------------------------------------------
      // Domain object
      // -----------------------------------------------------

      expect(updatedUser).toBeInstanceOf(User);

      expect(updatedUser.getId()).toBe(
        user.getId(),
      );

      expect(
        updatedUser
          .getPasswordHash()
          .getValue(),
      ).toBe(
        user
          .getPasswordHash()
          .getValue(),
      );

      expect(
        updatedUser.isEmailVerified(),
      ).toBe(true);

      expect(
        updatedUser.hasRole(
          Role.DRIVER,
        ),
      ).toBe(true);

      expect(
        updatedUser.getStatus(),
      ).toBe(
        UserStatus.SUSPENDED,
      );

      // -----------------------------------------------------
      // Database
      // -----------------------------------------------------

      const databaseUser =
        await prisma.user.findUnique({
          where: {
            id: user.getId(),
          },
        });

      expect(databaseUser).not.toBeNull();

      expect(
        databaseUser?.passwordHash,
      ).toBe(
        user
          .getPasswordHash()
          .getValue(),
      );

      expect(
        databaseUser?.emailVerified,
      ).toBe(true);

      expect(
        databaseUser?.roles,
      ).toContain(Role.CUSTOMER);

      expect(
        databaseUser?.roles,
      ).toContain(Role.DRIVER);

      expect(
        databaseUser?.status,
      ).toBe(
        UserStatus.SUSPENDED,
      );
    });
  });

  // =========================================================
  // UNIQUE EMAIL CONSTRAINT
  // =========================================================

  describe("unique email constraint", () => {
    it("should reject creating two users with the same email", async () => {
      const email =
        "duplicate@example.com";

      const firstUser =
        buildTestUser({
          email,
        });

      const secondUser =
        buildTestUser({
          email,
        });

      await repository.create(
        firstUser,
      );

      await expect(
        repository.create(secondUser),
      ).rejects.toMatchObject({
        code: "P2002",
      });
    });
  });
});
