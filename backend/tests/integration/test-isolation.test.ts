import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js"

import { Role, UserStatus } from "../../src/modules/identity/domain/enums/index.js"

describe("Integration Test Isolation", () => {
  let prisma: PrismaClient;

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
  });

  // =========================================================
  // CLEANUP
  // =========================================================

  beforeEach(async () => {
    /*
     * RefreshSession has a foreign key to User.
     *
     * Therefore:
     *
     * RefreshSession
     *      ↓
     * User
     *
     * Child records must be deleted first.
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
  // FACTORIES
  // =========================================================

  const createUser = async (
    suffix: string,
  ) => {
    return prisma.user.create({
      data: {
        id: crypto.randomUUID(),

        email: `${suffix}-${crypto.randomUUID()}@example.com`,

        passwordHash:
          "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",

        roles: [Role.CUSTOMER],

        status: UserStatus.ACTIVE,

        emailVerified: false,
      },
    });
  };

  const createRefreshSession = async (
    userId: string,
    suffix: string,
  ) => {
    return prisma.refreshSession.create({
      data: {
        id: crypto.randomUUID(),

        userId,

        tokenHash: `${suffix}-${crypto.randomUUID()}`,

        expiresAt: new Date(
          Date.now() + 1000 * 60 * 60,
        ),

        lastUsedAt: null,

        revokedAt: null,

        ipAddress: "127.0.0.1",

        userAgent: "vitest",
      },
    });
  };

  // =========================================================
  // CLEANUP STRATEGY
  // =========================================================

  describe("cleanup strategy", () => {
    it("should start with an empty database", async () => {
      const users = await prisma.user.findMany();

      const sessions =
        await prisma.refreshSession.findMany();

      expect(users).toEqual([]);

      expect(sessions).toEqual([]);
    });

    it("should clean data created by a previous test", async () => {
      const user = await createUser(
        "cleanup-test",
      );

      await createRefreshSession(
        user.id,
        "cleanup-session",
      );

      const usersBeforeCleanup =
        await prisma.user.count();

      const sessionsBeforeCleanup =
        await prisma.refreshSession.count();

      expect(usersBeforeCleanup).toBe(1);

      expect(sessionsBeforeCleanup).toBe(1);
    });

    it("should still start clean after the previous test", async () => {
      const users = await prisma.user.count();

      const sessions =
        await prisma.refreshSession.count();

      expect(users).toBe(0);

      expect(sessions).toBe(0);
    });
  });

  // =========================================================
  // DETERMINISTIC DATA
  // =========================================================

  describe("deterministic data", () => {
    it("should create predictable user data", async () => {
      const user = await prisma.user.create({
        data: {
          id: "00000000-0000-0000-0000-000000000001",

          email:
            "deterministic-user@example.com",

          passwordHash:
            "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",

          roles: [Role.CUSTOMER],

          status: UserStatus.ACTIVE,

          emailVerified: false,
        },
      });

      expect(user.id).toBe(
        "00000000-0000-0000-0000-000000000001",
      );

      expect(user.email).toBe(
        "deterministic-user@example.com",
      );

      expect(user.roles).toEqual([
        Role.CUSTOMER,
      ]);

      expect(user.status).toBe(
        UserStatus.ACTIVE,
      );

      expect(user.emailVerified).toBe(false);
    });

    it("should not depend on data created by another test", async () => {
      const user =
        await prisma.user.findUnique({
          where: {
            email:
              "deterministic-user@example.com",
          },
        });

      expect(user).toBeNull();
    });

    it("should create deterministic refresh session data", async () => {
      const user = await prisma.user.create({
        data: {
          id: "00000000-0000-0000-0000-000000000002",

          email:
            "deterministic-session-user@example.com",

          passwordHash:
            "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",

          roles: [Role.CUSTOMER],

          status: UserStatus.ACTIVE,

          emailVerified: false,
        },
      });

      const expiresAt =
        new Date("2030-01-01T00:00:00.000Z");

      const session =
        await prisma.refreshSession.create({
          data: {
            id: "00000000-0000-0000-0000-000000000001",

            userId: user.id,

            tokenHash:
              "deterministic-token-hash",

            expiresAt,

            lastUsedAt: null,

            revokedAt: null,

            ipAddress: "127.0.0.1",

            userAgent: "vitest",
          },
        });

      expect(session.id).toBe(
        "00000000-0000-0000-0000-000000000001",
      );

      expect(session.userId).toBe(
        user.id,
      );

      expect(session.tokenHash).toBe(
        "deterministic-token-hash",
      );

      expect(session.expiresAt.getTime()).toBe(
        expiresAt.getTime(),
      );

      expect(session.lastUsedAt).toBeNull();

      expect(session.revokedAt).toBeNull();
    });
  });

  // =========================================================
  // INDEPENDENT TESTS
  // =========================================================

  describe("independent tests", () => {
    it("should pass when creating only one user", async () => {
      const user = await createUser(
        "independent-user",
      );

      const users =
        await prisma.user.findMany();

      expect(users).toHaveLength(1);

      expect(users[0].id).toBe(
        user.id,
      );
    });

    it("should not see the user created by the previous test", async () => {
      const users =
        await prisma.user.findMany();

      expect(users).toEqual([]);
    });

    it("should pass when creating only one refresh session", async () => {
      const user = await createUser(
        "independent-session-user",
      );

      const session =
        await createRefreshSession(
          user.id,
          "independent-session",
        );

      const sessions =
        await prisma.refreshSession.findMany();

      expect(sessions).toHaveLength(1);

      expect(sessions[0].id).toBe(
        session.id,
      );

      expect(sessions[0].userId).toBe(
        user.id,
      );
    });

    it("should not see the refresh session created by the previous test", async () => {
      const users =
        await prisma.user.findMany();

      const sessions =
        await prisma.refreshSession.findMany();

      expect(users).toEqual([]);

      expect(sessions).toEqual([]);
    });

    it("should work without relying on test execution order", async () => {
      const user = await createUser(
        "order-independent-user",
      );

      const session =
        await createRefreshSession(
          user.id,
          "order-independent-session",
        );

      const foundUser =
        await prisma.user.findUnique({
          where: {
            id: user.id,
          },
        });

      const foundSession =
        await prisma.refreshSession.findUnique({
          where: {
            id: session.id,
          },
        });

      expect(foundUser).not.toBeNull();

      expect(foundSession).not.toBeNull();

      expect(foundSession?.userId).toBe(
        foundUser?.id,
      );
    });
  });

  // =========================================================
  // UNIQUE TEST DATA
  // =========================================================

  describe("unique test data", () => {
    it("should create users with unique identifiers", async () => {
      const user1 = await createUser(
        "unique-user",
      );

      const user2 = await createUser(
        "unique-user",
      );

      expect(user1.id).not.toBe(
        user2.id,
      );

      expect(user1.email).not.toBe(
        user2.email,
      );
    });

    it("should create refresh sessions with unique identifiers", async () => {
      const user = await createUser(
        "unique-session-user",
      );

      const session1 =
        await createRefreshSession(
          user.id,
          "unique-session",
        );

      const session2 =
        await createRefreshSession(
          user.id,
          "unique-session",
        );

      expect(session1.id).not.toBe(
        session2.id,
      );

      expect(session1.tokenHash).not.toBe(
        session2.tokenHash,
      );
    });
  });
});
