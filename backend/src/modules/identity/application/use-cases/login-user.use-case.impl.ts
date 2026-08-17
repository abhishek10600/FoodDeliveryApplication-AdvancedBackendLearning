import { inject, injectable } from "tsyringe";
import { LoginUserUseCase } from "./login-user.use-case.js";
import { LoginUserInput } from "../dto/login-user.dto.js";
import { LoginUserResult } from "../dto/login-user-result.dto.js";
import { IdentityTokens } from "../../infrastructure/persistence/tokens/identity.tokens.js";
import type { IUserRepository } from "../../domain/repositories/user.repository.js";
import { Email } from "../../domain/value-objects/email.vo.js";
import { InvalidCredentialsError } from "../../domain/errors/invalid-credentials.error.js";
import type { IPasswordHasher } from "../../domain/services/password-hasher.js";
import type { IJWTService } from "../../domain/services/jwt.service.js";
import { TokenType } from "../../domain/enums/token-type.enum.js";
import { env } from "../../../../config/env.config.js";
import type { IRefreshSessionRepository } from "../../domain/repositories/refresh-session.repository.js";
import type { ITokenHasher } from "../../domain/services/token-hasher.js";
import { RefreshSession } from "../../domain/entities/refresh-session.entity.js";

@injectable()
export class LoginUserUseCaseImpl implements LoginUserUseCase {
  constructor(

    @inject(IdentityTokens.UserRepository)
    private readonly userRepo: IUserRepository,

    @inject(IdentityTokens.RefreshSessionRepository)
    private readonly refreshSessionRepo: IRefreshSessionRepository,

    @inject(IdentityTokens.PasswordHasher)
    private readonly passwordHasher: IPasswordHasher,

    @inject(IdentityTokens.JwtService)
    private readonly jwtService: IJWTService,

    @inject(IdentityTokens.TokenHasher)
    private readonly tokenHasher: ITokenHasher


  ) { }

  async execute(input: LoginUserInput): Promise<LoginUserResult> {
    const email = Email.create(input.email)

    const user = await this.userRepo.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const isPasswordCorrect = await this.passwordHasher.comparePassword(input.password, user.getPasswordHash())

    if (!isPasswordCorrect) {
      throw new InvalidCredentialsError()
    }

    const accessTokenIssuedAt = Math.floor(Date.now() / 1000)

    const accessToken = await this.jwtService.signAccessToken({
      sub: user.getId(),
      roles: user.getRoles(),
      type: TokenType.ACCESS,
      iat: accessTokenIssuedAt,
      exp: env.JWT_ACCESS_EXPIRES_IN,
      iss: env.JWT_ISSUER,
      aud: env.JWT_AUDIENCE
    })

    const refreshTokenIssuedAt = Math.floor(Date.now() / 1000)

    const refreshToken = await this.jwtService.signRefreshToken({
      sub: user.getId(),
      roles: user.getRoles(),
      type: TokenType.REFRESH,
      iat: refreshTokenIssuedAt,
      exp: env.JWT_REFRESH_EXPIRES_IN,
      iss: env.JWT_ISSUER,
      aud: env.JWT_AUDIENCE
    })

    const hashedRefreshToken = this.tokenHasher.hash(refreshToken)

    const refreshSessionExpiresAt = new Date(Date.now() + env.JWT_REFRESH_EXPIRES_IN * 1000)

    const refreshSession = RefreshSession.create({
      userId: user.getId(),
      tokenHash: hashedRefreshToken,
      expiresAt: refreshSessionExpiresAt,
      ipAddress: null,
      userAgent: null,
    }, crypto.randomUUID())

    await this.refreshSessionRepo.create(refreshSession)

    return {
      user: {
        id: user.getId(),
        email: user.getEmail().getValue(),
        roles: user.getRoles(),
        status: user.getStatus(),
        emailVerified: user.isEmailVerified()
      },
      accessToken,
      refreshToken
    }
  }
}
