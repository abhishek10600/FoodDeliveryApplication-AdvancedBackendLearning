import { injectable, inject } from "tsyringe";
import { ForgotPasswordUseCase } from "./forgot-password.use-case.js";
import { ForgotPasswordInput } from "../dto/forgot-password.dto.js";
import { IdentityTokens } from "../../infrastructure/persistence/tokens/identity.tokens.js";
import type { IUserRepository } from "../../domain/repositories/user.repository.js";
import { Email } from "../../domain/value-objects/email.vo.js";
import { AuthenticationError } from "../../../../shared/errors/AuthenticationError.js";
import crypto from "node:crypto"
import type { ITokenHasher } from "../../domain/services/token-hasher.js";
import { env } from "../../../../config/env.config.js";
import { ResetPasswordEntity } from "../../domain/entities/reset-password.entity.js";
import type { IPasswordResetRepository } from "../../domain/repositories/password-reset.repository.js";
import { InfrastructureTokens } from "../../../../infrastructure/container/index.js";
import type { EmailService } from "../../../../infrastructure/email/email.service.js";

@injectable()
export class ForgotPasswordUseCaseImpl implements ForgotPasswordUseCase {
  constructor(

    @inject(IdentityTokens.UserRepository)
    private readonly userRepo: IUserRepository,

    @inject(IdentityTokens.PasswordResetRepository)
    private readonly passwordResetRepo: IPasswordResetRepository,

    @inject(IdentityTokens.TokenHasher)
    private readonly tokenHasher: ITokenHasher,

    @inject(InfrastructureTokens.EmailService)
    private readonly emailService: EmailService

  ) { }

  async execute(input: ForgotPasswordInput): Promise<void> {
    const email = Email.create(input.email)
    const user = await this.userRepo.findByEmail(email)


    if (!user) {
      throw new AuthenticationError("If the email is valid, we will send the password reset link there")
    }

    const rawResetPasswordToken = crypto.randomBytes(32).toString("hex")
    const hashedResetPasswordToken = this.tokenHasher.hash(rawResetPasswordToken)
    const resetPasswordTokenExpiry = new Date(Date.now() + env.RESET_PASSWORD_TOKEN_EXPIRY * 60 * 1000)

    const resetPasswordEntity = ResetPasswordEntity.create({
      userId: user.getId(),
      tokenHash: hashedResetPasswordToken,
      expiresAt: resetPasswordTokenExpiry
    })

    await this.passwordResetRepo.create(resetPasswordEntity)

    const resetPasswordUrl = `http://localhost:4000/api/v1/identity/reset-password/${rawResetPasswordToken}`

    console.log({
      resetPasswordUrl
    })

    // make this a background job - later
    await this.emailService.sendResetPasswordEmail(user.getEmail().getValue(), resetPasswordUrl)

  }
}
