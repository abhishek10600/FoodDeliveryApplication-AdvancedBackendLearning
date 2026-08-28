import { PrismaClient } from "../../generated/prisma/client.js"

import { RefreshSession } from "../../src/modules/identity/domain/entities/index.js"

export type CreateTestRefreshSessionOptions = Partial<{
  id: string;
  tokenHash: string;
  familyId: string;
  expiresAt: Date;
  lastUsedAt: Date | null;
  revokedAt: Date | null;
  ipAddress: string | null;
  userAgent: string | null
}>

export const buildTestRefreshSession = (
  userId: string,
  overrides: CreateTestRefreshSessionOptions = {},
): RefreshSession => {
  const session =
    RefreshSession.create(
      {
        userId,
        familyId: overrides.familyId ?? crypto.randomUUID(),
        tokenHash:
          overrides.tokenHash ??
          `test-token-hash-${crypto.randomUUID()}`,

        expiresAt:
          overrides.expiresAt ??
          new Date(
            Date.now() +
              1000 * 60 * 60,
          ),

        ipAddress:
          overrides.ipAddress ??
          "127.0.0.1",

        userAgent:
          overrides.userAgent ??
          "vitest",
      },

      overrides.id ??
        crypto.randomUUID(),
    );

  /*
   * RefreshSession.create() normally starts
   * with lastUsedAt/revokedAt as null.
   *
   * If you need these values in a factory,
   * mutate the domain entity through its
   * domain methods rather than bypassing them.
   */

  if (
    overrides.lastUsedAt
  ) {
    session.markAsUsed(
      overrides.lastUsedAt,
    );
  }

  if (
    overrides.revokedAt
  ) {
    session.revoke(
      overrides.revokedAt,
    );
  }

  return session;
};

/**
 * Creates and persists a RefreshSession
 * directly in PostgreSQL.
 *
 * The referenced User must already exist.
 */
export const createTestRefreshSession =
  async (
    prisma: PrismaClient,
    userId: string,
    overrides: CreateTestRefreshSessionOptions = {},
  ): Promise<RefreshSession> => {
    const session =
      buildTestRefreshSession(
        userId,
        overrides,
      );

    await prisma.refreshSession.create({
      data: {
        id:
          session.getId(),

        userId:
          session.getUserId(),

        tokenHash:
          session.getTokenHash(),

        expiresAt:
          session.getExpiresAt(),

        lastUsedAt:
          session.getLastUsedAt(),

        revokedAt:
          session.getRevokedAt(),

        ipAddress:
          session.getIpAddress(),

        userAgent:
          session.getUserAgent(),

        createdAt:
          session.getCreatedAt(),

        updatedAt:
          session.getUpdatedAt(),
      },
    });

    return session;
  };
