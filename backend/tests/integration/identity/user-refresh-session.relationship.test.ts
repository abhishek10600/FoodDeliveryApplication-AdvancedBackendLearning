import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client.js";

import { Role, UserStatus } from "../../../src/modules/identity/domain/enums/index.js";

describe("User → RefreshSession Relationship Integration Tests", () => {
  let prisma: PrismaClient;

  // ---------------------------------------------------------
  // SETUP
  // ---------------------------------------------------------

  beforeAll(async () => {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });

    prisma = new PrismaClient({
      adapter,
    });

    await prisma.$connect();
  });

  beforeEach(async () => {
    // RefreshSession depends on User.
    // Delete child records first.
    await prisma.refreshSession.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.refreshSession.deleteMany();
    await prisma.user.deleteMany();

    await prisma.$disconnect();
  });

  // ---------------------------------------------------------
  // TEST USER FACTORY
  // ---------------------------------------------------------

  const createTestUser = async () => {
    return prisma.user.create({
      data: {
        id: crypto.randomUUID(),

        email: `relationship-${crypto.randomUUID()}@example.com`,

        passwordHash:
          "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",

        roles: [Role.CUSTOMER],

        status: UserStatus.ACTIVE,

        emailVerified: false,
      },
    });
  };

  // ---------------------------------------------------------
  // TEST REFRESH SESSION FACTORY
  // ---------------------------------------------------------

  const createTestRefreshSession = async (
    userId: string,
  ) => {
    return prisma.refreshSession.create({
      data: {
        id: crypto.randomUUID(),

        userId,

        tokenHash: `token-hash-${crypto.randomUUID()}`,

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
  // USER → REFRESH SESSION
  // =========================================================

  describe("User → RefreshSession", () => {
    it("should associate a refresh session with the correct user", async () => {
      const user = await createTestUser();

      const session = await createTestRefreshSession(
        user.id,
      );

      const databaseSession =
        await prisma.refreshSession.findUnique({
          where: {
            id: session.id,
          },
        });

      expect(databaseSession).not.toBeNull();

      expect(databaseSession?.userId).toBe(
        user.id,
      );
    });

    it("should allow a user to have multiple refresh sessions", async () => {
      const user = await createTestUser();

      const session1 =
        await createTestRefreshSession(user.id);

      const session2 =
        await createTestRefreshSession(user.id);

      const sessions =
        await prisma.refreshSession.findMany({
          where: {
            userId: user.id,
          },
        });

      expect(sessions).toHaveLength(2);

      expect(
        sessions.map((session) => session.id),
      ).toEqual(
        expect.arrayContaining([
          session1.id,
          session2.id,
        ]),
      );
    });

    it("should not return another user's refresh sessions", async () => {
      const user1 = await createTestUser();

      const user2 = await createTestUser();

      const session1 =
        await createTestRefreshSession(user1.id);

      const session2 =
        await createTestRefreshSession(user2.id);

      const user1Sessions =
        await prisma.refreshSession.findMany({
          where: {
            userId: user1.id,
          },
        });

      expect(user1Sessions).toHaveLength(1);

      expect(user1Sessions[0].id).toBe(
        session1.id,
      );

      expect(user1Sessions[0].userId).toBe(
        user1.id,
      );

      expect(user1Sessions[0].id).not.toBe(
        session2.id,
      );
    });
  });

  // =========================================================
  // FOREIGN KEY
  // =========================================================

  describe("foreign key", () => {
    it("should reject a refresh session with a nonexistent user", async () => {
      const nonExistentUserId =
        crypto.randomUUID();

      await expect(
        createTestRefreshSession(
          nonExistentUserId,
        ),
      ).rejects.toMatchObject({
        code: "P2003",
      });
    });

    it("should allow a refresh session when the referenced user exists", async () => {
      const user = await createTestUser();

      const session =
        await createTestRefreshSession(
          user.id,
        );

      expect(session.userId).toBe(
        user.id,
      );

      const databaseUser =
        await prisma.user.findUnique({
          where: {
            id: user.id,
          },
        });

      expect(databaseUser).not.toBeNull();

      expect(databaseUser?.id).toBe(
        session.userId,
      );
    });
  });

  // =========================================================
  // CASCADE DELETE
  // =========================================================

  describe("cascade delete", () => {
    it("should delete refresh sessions when the user is deleted", async () => {
      const user = await createTestUser();

      await createTestRefreshSession(
        user.id,
      );

      await createTestRefreshSession(
        user.id,
      );

      const sessionsBeforeDelete =
        await prisma.refreshSession.findMany({
          where: {
            userId: user.id,
          },
        });

      expect(sessionsBeforeDelete).toHaveLength(
        2,
      );

      // Delete the parent.
      await prisma.user.delete({
        where: {
          id: user.id,
        },
      });

      // Children should have been deleted
      // automatically by the database relation.
      const sessionsAfterDelete =
        await prisma.refreshSession.findMany({
          where: {
            userId: user.id,
          },
        });

      expect(sessionsAfterDelete).toEqual([]);

      const deletedUser =
        await prisma.user.findUnique({
          where: {
            id: user.id,
          },
        });

      expect(deletedUser).toBeNull();
    });

    it("should only cascade delete sessions belonging to the deleted user", async () => {
      const user1 = await createTestUser();

      const user2 = await createTestUser();

      const user1Session =
        await createTestRefreshSession(
          user1.id,
        );

      const user2Session =
        await createTestRefreshSession(
          user2.id,
        );

      await prisma.user.delete({
        where: {
          id: user1.id,
        },
      });

      const deletedUserSessions =
        await prisma.refreshSession.findMany({
          where: {
            userId: user1.id,
          },
        });

      expect(deletedUserSessions).toEqual([]);

      const remainingUserSession =
        await prisma.refreshSession.findUnique({
          where: {
            id: user2Session.id,
          },
        });

      expect(remainingUserSession).not.toBeNull();

      expect(remainingUserSession?.userId).toBe(
        user2.id,
      );

      expect(remainingUserSession?.id).toBe(
        user2Session.id,
      );

      const deletedSession =
        await prisma.refreshSession.findUnique({
          where: {
            id: user1Session.id,
          },
        });

      expect(deletedSession).toBeNull();
    });
  });
});
