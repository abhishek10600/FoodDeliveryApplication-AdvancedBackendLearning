import { RefreshSession as PrismaRefreshSession } from "../../../../../../../generated/prisma/client.js";
import { RefreshSession } from "../../../../domain/entities/index.js";

export class RefreshSessionMapper {
  public static toDomain(prismaRefreshSession: PrismaRefreshSession): RefreshSession {
    return RefreshSession.reconstitute(prismaRefreshSession.id, {
      userId: prismaRefreshSession.userId,
      familyId: prismaRefreshSession.familyId,
      tokenHash: prismaRefreshSession.tokenHash,
      expiresAt: prismaRefreshSession.expiresAt,
      lastUsedAt: prismaRefreshSession.lastUsedAt,
      revokedAt: prismaRefreshSession.revokedAt,
      replacedBySessionId: prismaRefreshSession.replaceBySessionId,
      ipAddress: prismaRefreshSession.ipAddress,
      userAgent: prismaRefreshSession.userAgent,
      createdAt: prismaRefreshSession.createdAt,
      updatedAt: prismaRefreshSession.updatedAt
    })

  }

  public static toPersistence(refreshSession: RefreshSession) {
    return {
      id: refreshSession.getId(),
      userId: refreshSession.getUserId(),
      familyId: refreshSession.getFamilyId(),
      tokenHash: refreshSession.getTokenHash(),
      expiresAt: refreshSession.getExpiresAt(),
      lastUsedAt: refreshSession.getLastUsedAt(),
      revokedAt: refreshSession.getRevokedAt(),
      replacedSessionId: refreshSession.getReplacedBySessionId(),
      ipAddress: refreshSession.getIpAddress(),
      userAgent: refreshSession.getUserAgent(),
      createdAt: refreshSession.getCreatedAt(),
      updatedAt: refreshSession.getUpdatedAt()
    }
  }

  public static toUpdatePersistence(refreshSession: RefreshSession) {
    return {
      tokenHash: refreshSession.getTokenHash(),
      expiresAt: refreshSession.getExpiresAt(),
      lastUsedAt: refreshSession.getLastUsedAt(),
      revokedAt: refreshSession.getRevokedAt(),
      replaceBySessionId: refreshSession.getReplacedBySessionId(),
      ipAddress: refreshSession.getIpAddress(),
      userAgent: refreshSession.getUserAgent(),
      updatedAt: refreshSession.getUpdatedAt()
    }
  }
}
