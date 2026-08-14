import { injectable, inject } from "tsyringe"
import { IRefreshSessionRepository } from "../../../domain/repositories/index.js";
import { InfrastructureTokens } from "../../../../../infrastructure/container/tokens/infrastructure.tokens.js";
// import { PrismaClient } from "../../../../../../generated/prisma/client.js";
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
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
        lastUsedAt: data.lastUsedAt,
        revokedAt: data.revokedAt,
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

}
