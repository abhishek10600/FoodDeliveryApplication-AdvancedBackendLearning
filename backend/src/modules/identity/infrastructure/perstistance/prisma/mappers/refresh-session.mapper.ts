import { RefreshSession as PrismaRefreshSession } from "../../../../../../../generated/prisma/client.js";
import { RefreshSession } from "../../../../domain/entities/index.js";

export class RefreshSessionMapper {
  public static toDomain(prismaRefreshSession: PrismaRefreshSession): RefreshSession {
    return RefreshSession.reconstitute(prismaRefreshSession.id, {
      userId: prismaRefreshSession.userId,
      tokenHash: prismaRefreshSession.tokenHash,
      expiresAt: prismaRefreshSession.expiresAt,
      lastUsedAt: prismaRefreshSession.lastUsedAt,
      revokedAt: prismaRefreshSession.revokedAt,
      ipAddress: prismaRefreshSession.ipAddress,
      userAgent: prismaRefreshSession.userAgent,
      createdAt: prismaRefreshSession.createdAt,
      updatedAt: prismaRefreshSession.updatedAt
    })

  }

  public static toPersistance(refreshSession: RefreshSession) {
    return {
      id: refreshSession.getId(),
      userId: refreshSession.getUserId(),
      tokenHash: refreshSession.getTokenHash(),
      expiresAt: refreshSession.getExpiresAt(),
      lastUsedAt: refreshSession.getLastUsedAt(),
      revokedAt: refreshSession.getRevokedAt(),
      ipAddress: refreshSession.getIpAddress(),
      userAgent: refreshSession.getUserAgent(),
      createdAt: refreshSession.getCreatedAt(),
      updatedAt: refreshSession.getUpdatedAt()
    }
  }

  public static toUpdatePersistance(refreshSession: RefreshSession) {
    return {
      expiresAt: refreshSession.getExpiresAt(),
      lastUsedAt: refreshSession.getLastUsedAt(),
      revokedAt: refreshSession.getRevokedAt(),
      ipAddress: refreshSession.getIpAddress(),
      userAgent: refreshSession.getUserAgent(),
      updatedAt: refreshSession.getUpdatedAt()
    }
  }
}
