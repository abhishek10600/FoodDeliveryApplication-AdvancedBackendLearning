import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client.js";

import { RefreshSessionRepository } from "../../../src/modules/identity/infrastructure/persistence/prisma/refresh-session.repository.js";

import { RefreshSession, User } from "../../../src/modules/identity/domain/entities/index.js";

import { Role, UserStatus } from "../../../src/modules/identity/domain/enums/index.js";

import {
  Email,
  PasswordHash,
} from "../../../src/modules/identity/domain/value-objects/index.js";

describe("RefreshSessionRepository Integration Tests", () => {
  let prisma: PrismaClient;
  let repository: RefreshSessionRepository;

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

    repository = new RefreshSessionRepository(prisma);
  });

  beforeEach(async () => {
    /*
     * RefreshSession has a foreign key to User.
     *
     * Delete child records before parent records.
     */
    await prisma.refreshSession.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.refreshSession.deleteMany();
    await prisma.user.deleteMany();

    await prisma.$disconnect();
  });

  // ---------------------------------------------------------
  // TEST USER HELPER
  // ---------------------------------------------------------

  const createTestUser = async (): Promise<User> => {
    const user = new User({
      id: crypto.randomUUID(),

      email: Email.create(
        `refresh-test-${crypto.randomUUID()}@example.com`,
      ),

      passwordHash: PasswordHash.create(
        "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
      ),

      roles: [Role.CUSTOMER],

      status: UserStatus.ACTIVE,

      emailVerified: false,

      createdAt: new Date(),

      updatedAt: new Date(),
    });

    const createdUser = await prisma.user.create({
      data: {
        id: user.getId(),

        email: user.getEmail().getValue(),

        passwordHash: user
          .getPasswordHash()
          .getValue(),

        roles: user.getRoles(),

        status: user.getStatus(),

        emailVerified: user.isEmailVerified(),

        createdAt: user.getCreatedAt(),

        updatedAt: user.getUpdatedAt(),
      },
    });

    expect(createdUser.id).toBe(user.getId());

    return user;
  };

  // ---------------------------------------------------------
  // REFRESH SESSION FACTORY
  // ---------------------------------------------------------

  const createRefreshSession = (
    userId: string,

    overrides: Partial<{
      id: string;
      tokenHash: string;
      expiresAt: Date;
      ipAddress: string | null;
      userAgent: string | null;
    }> = {},
  ): RefreshSession => {
    return RefreshSession.create(
      {
        userId,

        tokenHash:
          overrides.tokenHash ??
          `token-hash-${crypto.randomUUID()}`,

        expiresAt:
          overrides.expiresAt ??
          new Date(Date.now() + 1000 * 60 * 60),

        ipAddress:
          overrides.ipAddress ?? "127.0.0.1",

        userAgent:
          overrides.userAgent ?? "vitest",
      },

      overrides.id ?? crypto.randomUUID(),
    );
  };

  // =========================================================
  // CREATE
  // =========================================================

  describe("create()", () => {
    it("should create a refresh session in the database", async () => {
      const user = await createTestUser();

      const session = createRefreshSession(
        user.getId(),
      );

      const createdSession =
        await repository.create(session);

      // Domain object
      expect(createdSession).toBeInstanceOf(
        RefreshSession,
      );

      expect(createdSession.getId()).toBe(
        session.getId(),
      );

      expect(createdSession.getUserId()).toBe(
        user.getId(),
      );

      expect(createdSession.getTokenHash()).toBe(
        session.getTokenHash(),
      );

      expect(
        createdSession.getExpiresAt().getTime(),
      ).toBe(
        session.getExpiresAt().getTime(),
      );

      expect(createdSession.getLastUsedAt()).toBeNull();

      expect(createdSession.getRevokedAt()).toBeNull();

      expect(createdSession.getIpAddress()).toBe(
        "127.0.0.1",
      );

      expect(createdSession.getUserAgent()).toBe(
        "vitest",
      );

      // Database verification
      const databaseSession =
        await prisma.refreshSession.findUnique({
          where: {
            id: session.getId(),
          },
        });

      expect(databaseSession).not.toBeNull();

      expect(databaseSession?.id).toBe(
        session.getId(),
      );

      expect(databaseSession?.userId).toBe(
        user.getId(),
      );

      expect(databaseSession?.tokenHash).toBe(
        session.getTokenHash(),
      );

      expect(databaseSession?.revokedAt).toBeNull();

      expect(databaseSession?.lastUsedAt).toBeNull();

      expect(databaseSession?.ipAddress).toBe(
        "127.0.0.1",
      );

      expect(databaseSession?.userAgent).toBe(
        "vitest",
      );
    });
  });

  // =========================================================
  // FIND BY ID
  // =========================================================

  describe("findById()", () => {
    it("should return the refresh session when the id exists", async () => {
      const user = await createTestUser();

      const session = createRefreshSession(
        user.getId(),
      );

      await repository.create(session);

      const foundSession =
        await repository.findById(
          session.getId(),
        );

      expect(foundSession).not.toBeNull();

      expect(foundSession).toBeInstanceOf(
        RefreshSession,
      );

      expect(foundSession?.getId()).toBe(
        session.getId(),
      );

      expect(foundSession?.getUserId()).toBe(
        user.getId(),
      );

      expect(foundSession?.getTokenHash()).toBe(
        session.getTokenHash(),
      );
    });

    it("should return null when the refresh session does not exist", async () => {
      const result =
        await repository.findById(
          crypto.randomUUID(),
        );

      expect(result).toBeNull();
    });
  });

  // =========================================================
  // FIND BY TOKEN HASH
  // =========================================================

  describe("findByTokenHash()", () => {
    it("should return the refresh session when the token hash exists", async () => {
      const user = await createTestUser();

      const tokenHash =
        `token-hash-${crypto.randomUUID()}`;

      const session = createRefreshSession(
        user.getId(),
        {
          tokenHash,
        },
      );

      await repository.create(session);

      const foundSession =
        await repository.findByTokenHash(
          tokenHash,
        );

      expect(foundSession).not.toBeNull();

      expect(foundSession).toBeInstanceOf(
        RefreshSession,
      );

      expect(foundSession?.getId()).toBe(
        session.getId(),
      );

      expect(foundSession?.getUserId()).toBe(
        user.getId(),
      );

      expect(foundSession?.getTokenHash()).toBe(
        tokenHash,
      );
    });

    it("should return null when the token hash does not exist", async () => {
      const result =
        await repository.findByTokenHash(
          `missing-${crypto.randomUUID()}`,
        );

      expect(result).toBeNull();
    });
  });

  // =========================================================
  // FIND BY USER ID
  // =========================================================

  describe("findByUserId()", () => {
    it("should return all refresh sessions belonging to the user", async () => {
      const user = await createTestUser();

      const session1 = createRefreshSession(
        user.getId(),
      );

      const session2 = createRefreshSession(
        user.getId(),
      );

      await repository.create(session1);
      await repository.create(session2);

      const sessions =
        await repository.findByUserId(
          user.getId(),
        );

      expect(sessions).toHaveLength(2);

      const ids = sessions.map(
        (session) => session.getId(),
      );

      expect(ids).toContain(
        session1.getId(),
      );

      expect(ids).toContain(
        session2.getId(),
      );
    });

    it("should return an empty array when the user has no refresh sessions", async () => {
      const user = await createTestUser();

      const sessions =
        await repository.findByUserId(
          user.getId(),
        );

      expect(sessions).toEqual([]);
    });

    it("should only return sessions belonging to the requested user", async () => {
      const user1 = await createTestUser();

      const user2 = await createTestUser();

      const session1 = createRefreshSession(
        user1.getId(),
      );

      const session2 = createRefreshSession(
        user2.getId(),
      );

      await repository.create(session1);
      await repository.create(session2);

      const sessions =
        await repository.findByUserId(
          user1.getId(),
        );

      expect(sessions).toHaveLength(1);

      expect(sessions[0].getId()).toBe(
        session1.getId(),
      );

      expect(sessions[0].getUserId()).toBe(
        user1.getId(),
      );
    });
  });

  // =========================================================
  // UPDATE
  // =========================================================

  describe("update()", () => {
    it("should update an existing refresh session", async () => {
      const user = await createTestUser();

      const session = createRefreshSession(
        user.getId(),
      );

      await repository.create(session);

      const usedAt = new Date();

      session.markAsUsed(usedAt);

      const updatedSession =
        await repository.update(session);

      expect(updatedSession).toBeInstanceOf(
        RefreshSession,
      );

      expect(
        updatedSession.getLastUsedAt(),
      ).not.toBeNull();

      expect(
        updatedSession.getLastUsedAt()?.getTime(),
      ).toBe(usedAt.getTime());

      // Verify database
      const databaseSession =
        await prisma.refreshSession.findUnique({
          where: {
            id: session.getId(),
          },
        });

      expect(databaseSession).not.toBeNull();

      expect(
        databaseSession?.lastUsedAt,
      ).not.toBeNull();

      expect(
        databaseSession?.lastUsedAt?.getTime(),
      ).toBe(usedAt.getTime());
    });

    it("should persist a revoked session through update()", async () => {
      const user = await createTestUser();

      const session = createRefreshSession(
        user.getId(),
      );

      await repository.create(session);

      const revokedAt = new Date();

      session.revoke(revokedAt);

      const updatedSession =
        await repository.update(session);

      expect(
        updatedSession.getRevokedAt(),
      ).not.toBeNull();

      expect(
        updatedSession.getRevokedAt()?.getTime(),
      ).toBe(revokedAt.getTime());

      // Verify database
      const databaseSession =
        await prisma.refreshSession.findUnique({
          where: {
            id: session.getId(),
          },
        });

      expect(databaseSession).not.toBeNull();

      expect(
        databaseSession?.revokedAt,
      ).not.toBeNull();

      expect(
        databaseSession?.revokedAt?.getTime(),
      ).toBe(revokedAt.getTime());
    });
  });

  // =========================================================
  // REVOKE
  // =========================================================

  describe("revoke()", () => {
    it("should revoke an existing refresh session", async () => {
      const user = await createTestUser();

      const session = createRefreshSession(
        user.getId(),
      );

      await repository.create(session);

      const revokedAt = new Date();

      await repository.revoke(
        session.getId(),
        revokedAt,
      );

      const databaseSession =
        await prisma.refreshSession.findUnique({
          where: {
            id: session.getId(),
          },
        });

      expect(databaseSession).not.toBeNull();

      expect(
        databaseSession?.revokedAt,
      ).not.toBeNull();

      expect(
        databaseSession?.revokedAt?.getTime(),
      ).toBe(revokedAt.getTime());
    });

    it("should revoke the correct refresh session", async () => {
      const user = await createTestUser();

      const session1 = createRefreshSession(
        user.getId(),
      );

      const session2 = createRefreshSession(
        user.getId(),
      );

      await repository.create(session1);
      await repository.create(session2);

      const revokedAt = new Date();

      await repository.revoke(
        session1.getId(),
        revokedAt,
      );

      const databaseSession1 =
        await prisma.refreshSession.findUnique({
          where: {
            id: session1.getId(),
          },
        });

      const databaseSession2 =
        await prisma.refreshSession.findUnique({
          where: {
            id: session2.getId(),
          },
        });

      expect(
        databaseSession1?.revokedAt,
      ).not.toBeNull();

      expect(
        databaseSession2?.revokedAt,
      ).toBeNull();
    });
  });
});
