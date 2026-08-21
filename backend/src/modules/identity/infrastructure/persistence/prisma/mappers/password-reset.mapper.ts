import { PasswordReset as PrismaPasswordReset } from "../../../../../../../generated/prisma/client.js";
import { ResetPasswordEntity } from "../../../../domain/entities/reset-password.entity.js";

export class PasswordResetMapper {
  public static toDomain(prismaPasswordReset: PrismaPasswordReset): ResetPasswordEntity {
    return ResetPasswordEntity.rehydrate({
      id: prismaPasswordReset.id,
      userId: prismaPasswordReset.userId,
      tokenHash: prismaPasswordReset.tokenHash,
      expiresAt: prismaPasswordReset.expiresAt,
      usedAt: prismaPasswordReset.usedAt,
      createdAt: prismaPasswordReset.createdAt,
      updatedAt: prismaPasswordReset.updatedAt
    })
  }

  public static toPersistance(resetPasswordEntity: ResetPasswordEntity):PrismaPasswordReset {
    return {
      id: resetPasswordEntity.getId(),
      userId: resetPasswordEntity.getUserId(),
      tokenHash: resetPasswordEntity.getTokenHash(),
      expiresAt: resetPasswordEntity.getExpiresAt(),
      usedAt: resetPasswordEntity.getUsedAt(),
      createdAt: resetPasswordEntity.getCreatedAt(),
      updatedAt: resetPasswordEntity.getUpdatedAt()
    }
  }
}
