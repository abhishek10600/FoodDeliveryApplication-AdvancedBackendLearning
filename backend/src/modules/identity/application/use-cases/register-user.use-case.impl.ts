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
import crypto from "node:crypto"
import { VerifyEmail } from "../../domain/entities/verify-email.entity.js";
import type { IVerifyEmailRepository } from "../../domain/repositories/verify-email.repository.js";
import type { IEmailJobQueue } from "../services/email-job-queue.js";
import { CustomerTokens } from "../../../customer/infrastructure/persistence/tokens/customer.tokens.js";
import type { CustomerProfileCreationUseCase } from "../../../customer/application/use-cases/customer-profile-creation.use-case.js";

@injectable()
export class RegisterUserUseCaseImpl implements RegisterUserUseCase {
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

    @inject(CustomerTokens.CustomerProfileCreationUseCase)
    private readonly customerProfileCreationUseCase: CustomerProfileCreationUseCase

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
      refreshSessionRepository,
      customerRepository
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

      const customerEntity = await this.customerProfileCreationUseCase.execute({
        userId: createdUser.getId(),
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone
      })

      await customerRepository.create(customerEntity)

      return createdUser;
    },
    )

    const rawEmailVerificationToken = crypto.randomBytes(32).toString("hex")
    const emailVerificationTokenHash = this.tokenHasher.hash(rawEmailVerificationToken)
    const verifyEmailTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000)

    const verifyEmail = VerifyEmail.create({
      userId: newUser.getId(),
      tokenHash: emailVerificationTokenHash,
      expiresAt: verifyEmailTokenExpiresAt
    })

    await this.verifyEmailRepo.create(verifyEmail)

    const verificationUrl = `http://localhost:4000/api/v1/identity/verify-email/${rawEmailVerificationToken}`

    console.log({ verificationUrl })

    await this.emailJobQueue.enqueueVerificationEmail({
      userId: newUser.getId(),
      email: newUser.getEmail().getValue(),
      verificationUrl
    })

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
