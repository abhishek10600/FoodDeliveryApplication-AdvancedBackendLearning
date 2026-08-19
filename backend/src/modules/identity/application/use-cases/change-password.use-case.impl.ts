import { injectable, inject } from "tsyringe";
import { ChangePasswordUseCase } from "./change-password.use-case.js";
import { ChangePasswordInput } from "../dto/change-password.dto.js";
import { IdentityTokens } from "../../infrastructure/persistence/tokens/identity.tokens.js";
import type { IUserRepository } from "../../domain/repositories/user.repository.js";
import type { IRefreshSessionRepository } from "../../domain/repositories/refresh-session.repository.js";
import { AppError } from "../../../../shared/errors/AppError.js";
import type { IPasswordHasher } from "../../domain/services/password-hasher.js";

@injectable()
export class ChangePasswordUseCaseImpl implements ChangePasswordUseCase {
  constructor(

    @inject(IdentityTokens.UserRepository)
    private readonly userRepo: IUserRepository,

    @inject(IdentityTokens.RefreshSessionRepository)
    private readonly refreshSessionRepo: IRefreshSessionRepository,

    @inject(IdentityTokens.PasswordHasher)
    private readonly passwordHasher: IPasswordHasher

  ) { }

  async execute(input: ChangePasswordInput): Promise<void> {

    const user = await this.userRepo.findById(input.userId)

    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND", true)
    }

    const isPasswordCorrect = await this.passwordHasher.comparePassword(input.currentPassword, user.getPasswordHash())

    if (!isPasswordCorrect) {
      throw new AppError("Invalid credentials", 428, "INVALID_CREDENTIALS", true)
    }

    const newPasswordHash = await this.passwordHasher.hashPassword(input.newPassword)

    user.changePassword(newPasswordHash)

    await this.userRepo.update(user)

    await this.refreshSessionRepo.revokeAllByUserId(input.userId, new Date())
  }
}
