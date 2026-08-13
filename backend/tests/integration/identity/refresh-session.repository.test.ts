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

import { createTestUser, createTestRefreshSession, buildTestRefreshSession } from "../../factories/index.js";

describe("RefreshSessionRepository Integration Tests", () => {
  let prisma: PrismaClient;
  let repository: RefreshSessionRepository;

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

    repository =
      new RefreshSessionRepository(
        prisma,
      );
  });

  beforeEach(async () => {
    /*
     * RefreshSession is the child.
     *
     * It references User through a foreign key.
     *
     * Therefore:
     *
     * RefreshSession
     *      ↓
     * User
     *
     * Child must be deleted first.
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
    it("should create a refresh session in the database", async () => {
      /*
       * User must exist because RefreshSession.userId
       * is a foreign key.
       */
      const user =
        await createTestUser(prisma);

      /*
       * We use buildTestRefreshSession() here because
       * the repository's create() method should be the
       * thing responsible for persistence.
       */
      const session =
        buildTestRefreshSession(
          user.getId(),
        );

      const createdSession =
        await repository.create(
          session,
        );

      // -----------------------------------------------------
      // Domain object
      // -----------------------------------------------------

      expect(
        createdSession,
      ).toBeInstanceOf(
        RefreshSession,
      );

      expect(
        createdSession.getId(),
      ).toBe(
        session.getId(),
      );

      expect(
        createdSession.getUserId(),
      ).toBe(
        user.getId(),
      );

      expect(
        createdSession.getTokenHash(),
      ).toBe(
        session.getTokenHash(),
      );

      expect(
        createdSession
          .getExpiresAt()
          .getTime(),
      ).toBe(
        session
          .getExpiresAt()
          .getTime(),
      );

      expect(
        createdSession.getLastUsedAt(),
      ).toBeNull();

      expect(
        createdSession.getRevokedAt(),
      ).toBeNull();

      expect(
        createdSession.getIpAddress(),
      ).toBe("127.0.0.1");

      expect(
        createdSession.getUserAgent(),
      ).toBe("vitest");

      // -----------------------------------------------------
      // Database
      // -----------------------------------------------------

      const databaseSession =
        await prisma.refreshSession.findUnique({
          where: {
            id: session.getId(),
          },
        });

      expect(
        databaseSession,
      ).not.toBeNull();

      expect(
        databaseSession?.id,
      ).toBe(
        session.getId(),
      );

      expect(
        databaseSession?.userId,
      ).toBe(
        user.getId(),
      );

      expect(
        databaseSession?.tokenHash,
      ).toBe(
        session.getTokenHash(),
      );

      expect(
        databaseSession?.revokedAt,
      ).toBeNull();

      expect(
        databaseSession?.lastUsedAt,
      ).toBeNull();

      expect(
        databaseSession?.ipAddress,
      ).toBe("127.0.0.1");

      expect(
        databaseSession?.userAgent,
      ).toBe("vitest");
    });
  });

  // =========================================================
  // FIND BY ID
  // =========================================================

  describe("findById()", () => {
    it("should return the refresh session when the id exists", async () => {
      const user =
        await createTestUser(prisma);

      const session =
        await createTestRefreshSession(
          prisma,
          user.getId(),
        );

      const foundSession =
        await repository.findById(
          session.getId(),
        );

      expect(
        foundSession,
      ).not.toBeNull();

      expect(
        foundSession,
      ).toBeInstanceOf(
        RefreshSession,
      );

      expect(
        foundSession?.getId(),
      ).toBe(
        session.getId(),
      );

      expect(
        foundSession?.getUserId(),
      ).toBe(
        user.getId(),
      );

      expect(
        foundSession?.getTokenHash(),
      ).toBe(
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
      const user =
        await createTestUser(prisma);

      const tokenHash =
        `token-hash-${crypto.randomUUID()}`;

      const session =
        await createTestRefreshSession(
          prisma,
          user.getId(),
          {
            tokenHash,
          },
        );

      const foundSession =
        await repository.findByTokenHash(
          tokenHash,
        );

      expect(
        foundSession,
      ).not.toBeNull();

      expect(
        foundSession,
      ).toBeInstanceOf(
        RefreshSession,
      );

      expect(
        foundSession?.getId(),
      ).toBe(
        session.getId(),
      );

      expect(
        foundSession?.getUserId(),
      ).toBe(
        user.getId(),
      );

      expect(
        foundSession?.getTokenHash(),
      ).toBe(
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
      const user =
        await createTestUser(prisma);

      const session1 =
        await createTestRefreshSession(
          prisma,
          user.getId(),
        );

      const session2 =
        await createTestRefreshSession(
          prisma,
          user.getId(),
        );

      const sessions =
        await repository.findByUserId(
          user.getId(),
        );

      expect(sessions).toHaveLength(2);

      const ids = sessions.map(
        (session) =>
          session.getId(),
      );

      expect(ids).toContain(
        session1.getId(),
      );

      expect(ids).toContain(
        session2.getId(),
      );
    });

    it("should return an empty array when the user has no refresh sessions", async () => {
      const user =
        await createTestUser(prisma);

      const sessions =
        await repository.findByUserId(
          user.getId(),
        );

      expect(sessions).toEqual([]);
    });

    it("should only return sessions belonging to the requested user", async () => {
      const user1 =
        await createTestUser(prisma);

      const user2 =
        await createTestUser(prisma);

      const session1 =
        await createTestRefreshSession(
          prisma,
          user1.getId(),
        );

      await createTestRefreshSession(
        prisma,
        user2.getId(),
      );

      const sessions =
        await repository.findByUserId(
          user1.getId(),
        );

      expect(sessions).toHaveLength(1);

      expect(
        sessions[0].getId(),
      ).toBe(
        session1.getId(),
      );

      expect(
        sessions[0].getUserId(),
      ).toBe(
        user1.getId(),
      );
    });
  });

  // =========================================================
  // UPDATE
  // =========================================================

  describe("update()", () => {
    it("should update an existing refresh session", async () => {
      const user =
        await createTestUser(prisma);

      /*
       * Persist initial state directly.
       */
      const session =
        await createTestRefreshSession(
          prisma,
          user.getId(),
        );

      const usedAt = new Date();

      /*
       * Mutate domain entity.
       */
      session.markAsUsed(
        usedAt,
      );

      /*
       * Repository is responsible for persisting
       * the domain change.
       */
      const updatedSession =
        await repository.update(
          session,
        );

      expect(
        updatedSession,
      ).toBeInstanceOf(
        RefreshSession,
      );

      expect(
        updatedSession.getLastUsedAt(),
      ).not.toBeNull();

      expect(
        updatedSession
          .getLastUsedAt()
          ?.getTime(),
      ).toBe(
        usedAt.getTime(),
      );

      // -----------------------------------------------------
      // Database
      // -----------------------------------------------------

      const databaseSession =
        await prisma.refreshSession.findUnique({
          where: {
            id: session.getId(),
          },
        });

      expect(
        databaseSession,
      ).not.toBeNull();

      expect(
        databaseSession?.lastUsedAt,
      ).not.toBeNull();

      expect(
        databaseSession
          ?.lastUsedAt
          ?.getTime(),
      ).toBe(
        usedAt.getTime(),
      );
    });

    it("should persist a revoked session through update()", async () => {
      const user =
        await createTestUser(prisma);

      const session =
        await createTestRefreshSession(
          prisma,
          user.getId(),
        );

      const revokedAt =
        new Date();

      session.revoke(
        revokedAt,
      );

      const updatedSession =
        await repository.update(
          session,
        );

      expect(
        updatedSession.getRevokedAt(),
      ).not.toBeNull();

      expect(
        updatedSession
          .getRevokedAt()
          ?.getTime(),
      ).toBe(
        revokedAt.getTime(),
      );

      // -----------------------------------------------------
      // Database
      // -----------------------------------------------------

      const databaseSession =
        await prisma.refreshSession.findUnique({
          where: {
            id: session.getId(),
          },
        });

      expect(
        databaseSession,
      ).not.toBeNull();

      expect(
        databaseSession
          ?.revokedAt,
      ).not.toBeNull();

      expect(
        databaseSession
          ?.revokedAt
          ?.getTime(),
      ).toBe(
        revokedAt.getTime(),
      );
    });
  });

  // =========================================================
  // REVOKE
  // =========================================================

  describe("revoke()", () => {
    it("should revoke an existing refresh session", async () => {
      const user =
        await createTestUser(prisma);

      const session =
        await createTestRefreshSession(
          prisma,
          user.getId(),
        );

      const revokedAt =
        new Date();

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

      expect(
        databaseSession,
      ).not.toBeNull();

      expect(
        databaseSession?.revokedAt,
      ).not.toBeNull();

      expect(
        databaseSession
          ?.revokedAt
          ?.getTime(),
      ).toBe(
        revokedAt.getTime(),
      );
    });

    it("should revoke the correct refresh session", async () => {
      const user =
        await createTestUser(prisma);

      const session1 =
        await createTestRefreshSession(
          prisma,
          user.getId(),
        );

      const session2 =
        await createTestRefreshSession(
          prisma,
          user.getId(),
        );

      const revokedAt =
        new Date();

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
