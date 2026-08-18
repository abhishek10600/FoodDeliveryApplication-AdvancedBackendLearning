import { injectable, inject } from "tsyringe";
import { RegisterUserUseCase } from "./register-user.use-case.js";
import { RegisterUserInput } from "../dto/register-user.dto.js";
import { RegisterUserResult } from "../dto/register-user-result.dto.js";
import { Email } from "../../domain/value-objects/email.vo.js";
import { EmailAlreadyRegisteredError } from "../../domain/errors/email-already-register.error.js";
import { IdentityTokens } from "../../infrastructure/persistence/tokens/identity.tokens.js";
import { User } from "../../domain/entities/user.entity.js";
import type { IPasswordHasher } from "../../domain/services/password-hasher.js";
import type { IJWTService } from "../../domain/services/jwt.service.js";
import { TokenType } from "../../domain/enums/token-type.enum.js";
import { env } from "../../../../config/env.config.js";
import type{ ITokenHasher } from "../../domain/services/token-hasher.js";
import { RefreshSession } from "../../domain/entities/refresh-session.entity.js";
import type { IIdentityTransaction } from "../transaction/identity.transaction.js";

@injectable()
export class RegisterUserUseCaseImpl implements RegisterUserUseCase {
  constructor(

    @inject(IdentityTokens.PasswordHasher)
    private readonly passwordHasher: IPasswordHasher,

    @inject(IdentityTokens.JwtService)
    private readonly jwtService: IJWTService,

    @inject(IdentityTokens.TokenHasher)
    private readonly tokenHasher: ITokenHasher,

    @inject(IdentityTokens.Transaction)
    private readonly transaction: IIdentityTransaction

  ) { }

  async execute(input: RegisterUserInput): Promise<RegisterUserResult> {
    const email = Email.create(input.email)

    const passwordHash = await this.passwordHasher.hashPassword(input.password)

    const user = User.create({
      email,
      passwordHash,
    })

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

    const hashedRrefreshToken = this.tokenHasher.hash(refreshToken)

    const refreshSessionExpiresAt = new Date(Date.now() + env.JWT_REFRESH_EXPIRES_IN * 1000)

    const newUser = await this.transaction.execute(async ({
      userRepository,
      refreshSessionRepository
    }) => {
      const existingUser = await userRepository.existsByEmail(email)

      if (existingUser) {
        throw new EmailAlreadyRegisteredError()
      }

      const createdUser = await userRepository.create(user);

      const refreshSession = RefreshSession.create({
        userId: createdUser.getId(),
        familyId: crypto.randomUUID(),
        tokenHash: hashedRrefreshToken,
        expiresAt: refreshSessionExpiresAt,
        ipAddress: null,
        userAgent: null,
      }, crypto.randomUUID()
      );

      await refreshSessionRepository.create(refreshSession)

      return createdUser;
    },
    )

    return {
      user: {
        id: newUser.getId(),
        email: newUser.getEmail().getValue(),
        roles: newUser.getRoles(),
        status: newUser.getStatus(),
        emailVerified: newUser.isEmailVerified()
      },
      accessToken,
      refreshToken
    }
  }
}
