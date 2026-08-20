import { EmailVerification as PrismaVerifyEmail } from "../../../../../../../generated/prisma/client.js";
import { VerifyEmail } from "../../../../domain/entities/index.js";

export class VerifyEmailMapper {
  public static toDomain(prismaVerifyEmail: PrismaVerifyEmail): VerifyEmail {
    return VerifyEmail.rehydrate({
      id: prismaVerifyEmail.id,
      userId: prismaVerifyEmail.userId,
      tokenHash: prismaVerifyEmail.tokenHash,
      expiresAt: prismaVerifyEmail.expiresAt,
      verifiedAt: prismaVerifyEmail.verifiedAt,
      createdAt: prismaVerifyEmail.createdAt,
      updatedAt: prismaVerifyEmail.updatedAt
    })
  }

  public static toPersistance(verifyEmail: VerifyEmail): PrismaVerifyEmail {
    return {
      id: verifyEmail.getId(),
      userId: verifyEmail.getUserId(),
      tokenHash: verifyEmail.getTokenHash(),
      expiresAt: verifyEmail.getExpiresAt(),
      verifiedAt: verifyEmail.getVerifiedAt(),
      createdAt: verifyEmail.getCreatedAt(),
      updatedAt: verifyEmail.getUpdatedAt()
    }
  }
}
