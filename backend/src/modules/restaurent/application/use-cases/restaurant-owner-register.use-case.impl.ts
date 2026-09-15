import { injectable, inject } from "tsyringe";
import { RegisterRestaurantOwnerResult } from "../dto/restaurant-owner-register-result.dto.js";
import { RestaurantOwnerRegisterInput } from "../dto/restaurant-owner-register.dto.js";
import { RestaurantOwnerRegisterUseCase } from "./restaurant-owner-register.use-case.js";
import { IdentityTokens } from "../../../identity/infrastructure/persistence/tokens/identity.tokens.js";
import { Email } from "../../../identity/domain/value-objects/email.vo.js";
import type { IPasswordHasher } from "../../../identity/domain/services/password-hasher.js";
import { RestaurantOwner } from "../../domain/entities/restaurant-owner.entity.js";
import type { IJWTService } from "../../../identity/domain/services/jwt.service.js";
import type { ITokenHasher } from "../../../identity/domain/services/token-hasher.js";
import type { IIdentityTransaction } from "../../../identity/application/transaction/identity.transaction.js";
import type { IEmailJobQueue } from "../../../identity/application/services/email-job-queue.js";
import { env } from "../../../../config/env.config.js";
import { TokenType } from "../../../identity/domain/enums/token-type.enum.js";
import { EmailAlreadyRegisteredError } from "../../../identity/domain/errors/email-already-register.error.js";
import { RefreshSession } from "../../../identity/domain/entities/refresh-session.entity.js";
import crypto from "node:crypto"
import { VerifyEmail } from "../../../identity/domain/entities/verify-email.entity.js";
import type { IVerifyEmailRepository } from "../../../identity/domain/repositories/verify-email.repository.js";

@injectable()
export class RestaurantOwnerRegisterUseCaseImpl implements RestaurantOwnerRegisterUseCase {

  constructor(

    @inject(IdentityTokens.VerifyEmailRepository)
    private readonly verifyEmailRepo: IVerifyEmailRepository,

    @inject(IdentityTokens.PasswordHasher)
    private readonly passwordHasher: IPasswordHasher,

    @inject(IdentityTokens.JwtService)
    private readonly jwtService: IJWTService,

    @inject(IdentityTokens.TokenHasher)
    private readonly tokenHasher: ITokenHasher,

    @inject(IdentityTokens.Transaction)
    private readonly transaction: IIdentityTransaction,

    @inject(IdentityTokens.EmailJobQueue)
    private readonly emailJobQueue: IEmailJobQueue,

  ) { }

  async execute(input: RestaurantOwnerRegisterInput): Promise<RegisterRestaurantOwnerResult> {
    const email = Email.create(input.email)

    const passwordHash = await this.passwordHasher.hashPassword(input.password)

    const restaurantOwner = RestaurantOwner.create({
      email,
      passwordHash
    })

    const accessTokenIssuedAt = Math.floor(Date.now() / 1000)

    const accessToken = await this.jwtService.signAccessToken({
      sub: restaurantOwner.getId(),
      roles: restaurantOwner.getRoles(),
      type: TokenType.ACCESS,
      iat: accessTokenIssuedAt,
      exp: env.JWT_ACCESS_EXPIRES_IN,
      iss: env.JWT_ISSUER,
      aud: env.JWT_AUDIENCE
    })

     const refreshTokenIssuedAt = Math.floor(Date.now() / 1000)

    const refreshToken = await this.jwtService.signRefreshToken({
      sub: restaurantOwner.getId(),
      roles: restaurantOwner.getRoles(),
      type: TokenType.REFRESH,
      iat: refreshTokenIssuedAt,
      exp: env.JWT_REFRESH_EXPIRES_IN,
      iss: env.JWT_ISSUER,
      aud: env.JWT_AUDIENCE
    })

    const hashedRrefreshToken = this.tokenHasher.hash(refreshToken)

    const refreshSessionExpiresAt = new Date(Date.now() + env.JWT_REFRESH_EXPIRES_IN * 1000)

    const newRestaurantOwner = await this.transaction.execute(async ({
      userRepository,
      refreshSessionRepository,
    }) => {
      const existingUser = await userRepository.existsByEmail(email)

      if (existingUser) {
        throw new EmailAlreadyRegisteredError()
      }

      const createdRestaurantOwner = await userRepository.createRestaurantOwner(restaurantOwner)

      const refreshSession = RefreshSession.create({
        userId: createdRestaurantOwner.getId(),
        familyId: crypto.randomUUID(),
        tokenHash: hashedRrefreshToken,
        expiresAt: refreshSessionExpiresAt,
        ipAddress: null,
        userAgent: null,
      }, crypto.randomUUID()
      );

      await refreshSessionRepository.create(refreshSession)

      return createdRestaurantOwner;
    },
    )

    const rawEmailVerificationToken = crypto.randomBytes(32).toString("hex")
    const emailVerificationTokenHash = this.tokenHasher.hash(rawEmailVerificationToken)
    const verifyEmailTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000)

    const verifyEmail = VerifyEmail.create({
      userId: newRestaurantOwner.getId(),
      tokenHash: emailVerificationTokenHash,
      expiresAt: verifyEmailTokenExpiresAt
    })

    await this.verifyEmailRepo.create(verifyEmail)

    const verificationUrl = `http://localhost:4000/api/v1/identity/verify-email/${rawEmailVerificationToken}`

    console.log({ verificationUrl })

    await this.emailJobQueue.enqueueVerificationEmail({
      userId: newRestaurantOwner.getId(),
      email: newRestaurantOwner.getEmail().getValue(),
      verificationUrl
    })

    return {
      restaurant_owner: {
        id: newRestaurantOwner.getId(),
        email: newRestaurantOwner.getEmail().getValue(),
        roles: newRestaurantOwner.getRoles(),
        status: newRestaurantOwner.getStatus(),
        emailVerified: newRestaurantOwner.isEmailVerified()
      },
      accessToken,
      refreshToken
    }

  }

}
