import { injectable, inject } from "tsyringe";
import { ResetPasswordUseCase } from "./rest-password.use-case.js";
import { ResetPasswordInput } from "../dto/reset-password.dto.js";
import { IdentityTokens } from "../../infrastructure/persistence/tokens/identity.tokens.js";
import type { ITokenHasher } from "../../domain/services/token-hasher.js";
import type { IPasswordResetRepository } from "../../domain/repositories/password-reset.repository.js";
import { AuthenticationError } from "../../../../shared/errors/AuthenticationError.js";
import type { IUserRepository } from "../../domain/repositories/user.repository.js";
import type { IPasswordHasher } from "../../domain/services/password-hasher.js";

@injectable()
export class ResetPasswordUseCaseImpl implements ResetPasswordUseCase {
  constructor(

    @inject(IdentityTokens.UserRepository)
    private readonly userRepo: IUserRepository,

    @inject(IdentityTokens.PasswordResetRepository)
    private readonly passwordResetRepo: IPasswordResetRepository,

    @inject(IdentityTokens.TokenHasher)
    private readonly tokenHasher: ITokenHasher,

    @inject(IdentityTokens.PasswordHasher)
    private readonly passwordHasher: IPasswordHasher

  ) { }

  async execute(input: ResetPasswordInput): Promise<void> {
    const tokenHash = this.tokenHasher.hash(input.token)

    const resetPasswordEntity = await this.passwordResetRepo.findByTokenHash(tokenHash)

    if (!resetPasswordEntity) {
      throw new AuthenticationError("Invalid token or token expired.")
    }

    const now = new Date()

    if (resetPasswordEntity.getUsedAt()) {
      throw new AuthenticationError("Invalid token or token expired.")
    }

    if (resetPasswordEntity.getExpiresAt() < now) {
      throw new AuthenticationError("Invalid token or token expired.")
    }

    const user = await this.userRepo.findById(resetPasswordEntity.getUserId())

    if (!user) {
      throw new AuthenticationError("Invalid token or token expired.")
    }

    const newPasswordHash = await this.passwordHasher.hashPassword(input.newPassword)

    user.changePassword(newPasswordHash)

    const resetPasswordUpdatedAt = new Date()

    resetPasswordEntity.updateUsedAt(resetPasswordUpdatedAt)

    await this.passwordResetRepo.update(resetPasswordEntity)

    await this.userRepo.update(user)
  }
}
