import { injectable, inject } from "tsyringe";
import { RefreshTokenUseCase } from "./refresh-token.use-case.js";
import { RefreshTokenResult } from "../dto/refresh-token-result.dto.js";
import { RefreshTokenInput } from "../dto/refresh-token.dto.js";
import { IdentityTokens } from "../../infrastructure/persistence/tokens/identity.tokens.js";
import { IdentityTransaction } from "../../infrastructure/persistence/prisma/identity.transaction.js";
import type { IJWTService } from "../../domain/services/jwt.service.js";
import { TokenType } from "../../domain/enums/token-type.enum.js";
import { InvalidRefreshTokenError } from "../../domain/errors/invalid-refresh-token.error.js";
import type { ITokenHasher } from "../../domain/services/token-hasher.js";
import type { IRefreshSessionRepository } from "../../domain/repositories/refresh-session.repository.js";
import { RefreshTokenReuseError } from "../../domain/errors/refresh-token-reuse.error.js";
import type { IUserRepository } from "../../domain/repositories/user.repository.js";
import { env } from "../../../../config/env.config.js";
import { RefreshSession } from "../../domain/entities/refresh-session.entity.js";

@injectable()
export class RefreshTokenUseCaseImpl implements RefreshTokenUseCase {
  constructor(

    @inject(IdentityTokens.JwtService)
    private readonly jwtService: IJWTService,

    @inject(IdentityTokens.TokenHasher)
    private readonly tokenHasher: ITokenHasher,

    @inject(IdentityTokens.RefreshSessionRepository)
    private readonly refreshSessionRepo: IRefreshSessionRepository,

    @inject(IdentityTokens.UserRepository)
    private readonly userRepo: IUserRepository,

    @inject(IdentityTokens.Transaction)
    private readonly transaction: IdentityTransaction

  ) { }

  async execute(input: RefreshTokenInput): Promise<RefreshTokenResult> {

    const payload = await this.jwtService.verifyRefreshToken(input.refreshToken)

    if (!payload || payload.type !== TokenType.REFRESH || !payload.sub) {
      throw new InvalidRefreshTokenError()
    }

    const tokenHash = this.tokenHasher.hash(input.refreshToken)

    const session = await this.refreshSessionRepo.findByTokenHash(tokenHash)

    if (!session) {
      throw new InvalidRefreshTokenError();
    }

    if (session.getUserId() !== payload.sub) {
      throw new InvalidRefreshTokenError()
    }

    if (session.isExpired()) {
      throw new InvalidRefreshTokenError()
    }

    if (session.isRevoked() || session.isRotated()) {
      await this.refreshSessionRepo.revokeFamily(session.getFamilyId(), new Date())

      throw new RefreshTokenReuseError();
    }

    const user = await this.userRepo.findById(session.getUserId())

    if (!user) {
      throw new InvalidRefreshTokenError()
    }

    if (user.getStatus() !== "ACTIVE") {
      throw new InvalidRefreshTokenError()
    }

    const iat = Math.floor(Date.now() / 1000)

    const accessToken = await this.jwtService.signAccessToken({
      sub: user.getId(),
      roles: user.getRoles(),
      type: TokenType.ACCESS,
      iat,
      exp: env.JWT_ACCESS_EXPIRES_IN,
      iss: env.JWT_ISSUER,
      aud: env.JWT_AUDIENCE
    })

    const newRefreshToken = await this.jwtService.signRefreshToken({
      sub: user.getId(),
      roles: user.getRoles(),
      type: TokenType.REFRESH,
      iat,
      exp: env.JWT_REFRESH_EXPIRES_IN,
      iss: env.JWT_ISSUER,
      aud: env.JWT_AUDIENCE
    })

    const newRefreshTokenHash = this.tokenHasher.hash(newRefreshToken)

    const replacementSessionId = crypto.randomUUID()

    const replacementExpiresAt = new Date(Date.now() + env.JWT_REFRESH_EXPIRES_IN * 1000)

    const replacementSession = RefreshSession.create({
      userId: user.getId(),
      familyId: session.getFamilyId(),
      tokenHash: newRefreshTokenHash,
      expiresAt: replacementExpiresAt,
      ipAddress: null,
      userAgent: null
    }, replacementSessionId)

    const rotated = await this.transaction.execute(async ({ refreshSessionRepository }) => {

      const claimed = await refreshSessionRepository.rotate(session.getId(), replacementSessionId, new Date());

      if (!claimed) {
        await refreshSessionRepository.revokeFamily(session.getFamilyId(), new Date())

        return false;
      }

      await refreshSessionRepository.create(replacementSession)

      return true
    })

    if (!rotated) {
      throw new RefreshTokenReuseError()
    }

    return {
      user: {
        id: user.getId(),
        email: user.getEmail().getValue(),
        roles: user.getRoles(),
        status: user.getStatus(),
        emailVerified: user.isEmailVerified()
      },
      accessToken,
      refreshToken: newRefreshToken
    }
  }
}
