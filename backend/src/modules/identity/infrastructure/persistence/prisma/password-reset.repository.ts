import { injectable, inject } from "tsyringe";
import { IPasswordResetRepository } from "../../../domain/repositories/password-reset.repository.js";
import { InfrastructureTokens } from "../../../../../infrastructure/container/index.js";
import type { PrismaExecutor } from "../../../../../infrastructure/database/prisma-client.type.js";
import { ResetPasswordEntity } from "../../../domain/entities/reset-password.entity.js";
import { PasswordResetMapper } from "./mappers/password-reset.mapper.js";

@injectable()
export class PasswordResetRepository implements IPasswordResetRepository {
  constructor(

    @inject(InfrastructureTokens.PrismaClient)
    private readonly prisma: PrismaExecutor

  ) { }

  async create(resetPassword: ResetPasswordEntity): Promise<ResetPasswordEntity> {
    const createdResetPassword = await this.prisma.passwordReset.create({
      data: {
        id: resetPassword.getId(),
        userId: resetPassword.getUserId(),
        tokenHash: resetPassword.getTokenHash(),
        expiresAt: resetPassword.getExpiresAt(),
        usedAt: resetPassword.getUsedAt(),
        createdAt: resetPassword.getCreatedAt(),
        updatedAt: resetPassword.getUpdatedAt()
      }
    })

    return PasswordResetMapper.toDomain(createdResetPassword)
  }

  async findByTokenHash(tokenHash: string): Promise<ResetPasswordEntity | null> {
    const resetPassword = await this.prisma.passwordReset.findUnique({
      where: {
        tokenHash
      }
    })

    if (!resetPassword) {
      return null
    }

    return PasswordResetMapper.toDomain(resetPassword)
  }

  async update(resetPassword: ResetPasswordEntity): Promise<ResetPasswordEntity> {

    const updatedResetPassword = await this.prisma.passwordReset.update({
      where: {
        id: resetPassword.getId()
      },
      data: {
        userId: resetPassword.getUserId(),
        tokenHash: resetPassword.getTokenHash(),
        expiresAt: resetPassword.getExpiresAt(),
        usedAt: resetPassword.getUpdatedAt()
      }
    })

    return PasswordResetMapper.toDomain(updatedResetPassword)
  }
}
