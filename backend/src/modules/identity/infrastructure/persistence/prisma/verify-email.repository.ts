import { injectable, inject } from "tsyringe";
import { VerifyEmail } from "../../../domain/entities/verify-email.entity.js";
import { IVerifyEmailRepository } from "../../../domain/repositories/verify-email.repository.js";
import { InfrastructureTokens } from "../../../../../infrastructure/container/index.js";
import type { PrismaExecutor } from "../../../../../infrastructure/database/prisma-client.type.js";
import { VerifyEmailMapper } from "./mappers/verify-email.mapper.js";

@injectable()
export class VerifyEmailRespository implements IVerifyEmailRepository {

  constructor(

    @inject(InfrastructureTokens.PrismaClient)
    private readonly prisma: PrismaExecutor

  ) { }

  async findByToken(tokenHash: string): Promise<VerifyEmail | null> {
    const verifyEmailResult = await this.prisma.emailVerification.findUnique({
      where: {
        tokenHash
      }
    })

    if (!verifyEmailResult) {
      return null
    }

    return VerifyEmailMapper.toDomain(verifyEmailResult)
  }

  async create(verifyEmail: VerifyEmail): Promise<VerifyEmail> {
    const verifyEmailResult = await this.prisma.emailVerification.create({
      data: {
        id: verifyEmail.getId(),
        userId: verifyEmail.getUserId(),
        tokenHash: verifyEmail.getTokenHash(),
        expiresAt: verifyEmail.getExpiresAt(),
        verifiedAt: null,
        createdAt: verifyEmail.getCreatedAt(),
        updatedAt: verifyEmail.getUpdatedAt()
      }
    })

    return VerifyEmailMapper.toDomain(verifyEmailResult)
  }

  async updateVerifiedAt(id: string, verifiedAt: Date): Promise<void> {
    await this.prisma.emailVerification.update({
      where: {
        id,
        verifiedAt: null,
        expiresAt: {
          gt: verifiedAt
        }
      },
      data: {
        verifiedAt
      }
    })
  }



}
