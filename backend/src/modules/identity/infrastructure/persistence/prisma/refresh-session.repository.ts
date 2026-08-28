import { injectable, inject } from "tsyringe"
import { IRefreshSessionRepository } from "../../../domain/repositories/index.js";
import { InfrastructureTokens } from "../../../../../infrastructure/container/tokens/infrastructure.tokens.js";
import { RefreshSession } from "../../../domain/entities/index.js";
import { RefreshSessionMapper } from "./mappers/refresh-session.mapper.js";
import type { PrismaExecutor } from "../../../../../infrastructure/database/prisma-client.type.js";

@injectable()
export class RefreshSessionRepository implements IRefreshSessionRepository {

  constructor(
    @inject(InfrastructureTokens.PrismaClient)
    private readonly prisma: PrismaExecutor
  ) { }

  async create(refreshSession: RefreshSession): Promise<RefreshSession> {
    const data = RefreshSessionMapper.toPersistence(refreshSession)

    const createdRefreshSession = await this.prisma.refreshSession.create({
      data: {
        id: data.id,
        userId: data.userId,
        familyId: data.familyId,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
        lastUsedAt: data.lastUsedAt,
        revokedAt: data.revokedAt,
        replaceBySessionId: data.replacedSessionId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      }
    })

    return RefreshSessionMapper.toDomain(createdRefreshSession)
  }

  async findById(id: string): Promise<RefreshSession | null> {
    const refreshSession = await this.prisma.refreshSession.findUnique({
      where: {
        id
      }
    })

    if (!refreshSession) {
      return null
    }

    return RefreshSessionMapper.toDomain(refreshSession)
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshSession | null> {
    const refreshSession = await this.prisma.refreshSession.findUnique({
      where: {
        tokenHash
      }
    })

    if (!refreshSession) {
      return null
    }

    return RefreshSessionMapper.toDomain(refreshSession)
  }

  async findByUserId(userId: string): Promise<RefreshSession[]> {
    const refreshSessions = await this.prisma.refreshSession.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return refreshSessions.map(RefreshSessionMapper.toDomain)
  }

  async findByFamilyId(familyId: string): Promise<RefreshSession[]> {
    const refreshSession = await this.prisma.refreshSession.findMany({
      where: {
        familyId
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return refreshSession.map(RefreshSessionMapper.toDomain)
  }

  async update(refreshSession: RefreshSession): Promise<RefreshSession> {
    const data = RefreshSessionMapper.toUpdatePersistence(refreshSession);

    const updatedRefreshSession = await this.prisma.refreshSession.update({
      where: {
        id: refreshSession.getId()
      },
      data
    })

    return RefreshSessionMapper.toDomain(updatedRefreshSession)
  }

  async revoke(id: string, revokedAt: Date): Promise<void> {
    await this.prisma.refreshSession.update({
      where: {
        id
      },
      data: {
        revokedAt
      }
    })
  }

  async revokeFamily(familyId: string, revokedAt: Date): Promise<void> {
    await this.prisma.refreshSession.updateMany({
      where: {
        familyId,
        revokedAt: null
      },
      data: {
        revokedAt
      }
    })
  }

  async revokeByTokenHash(tokenHash: string, revokedAt: Date): Promise<void> {
    await this.prisma.refreshSession.update({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: {
          gt: revokedAt
        }
      },
      data: {
        revokedAt
      }
    })
  }

  async revokeAllByUserId(userId: string, revokedAt: Date): Promise<void> {
    await this.prisma.refreshSession.updateMany({
      where: {
        userId,
        revokedAt: null
      },
      data: {
        revokedAt
      }
    })
  }

  async rotate(sessionId: string, replacementSessionId: string, usedAt: Date): Promise<boolean> {
    const result = await this.prisma.refreshSession.updateMany({
      where: {
        id: sessionId,
        revokedAt: null,
        expiresAt: {
          gt: usedAt,
        },
        replaceBySessionId: null,
      },
      data: {
        revokedAt: usedAt,
        lastUsedAt: usedAt,
        replaceBySessionId: replacementSessionId
      }
    })

    return result.count === 1;
  }

}
