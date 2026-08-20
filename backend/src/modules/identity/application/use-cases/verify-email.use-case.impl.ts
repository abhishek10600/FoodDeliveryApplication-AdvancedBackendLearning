import { injectable, inject } from "tsyringe";
import { VerifyEmailUseCase } from "./verify-email.use-case.js";
import { VerifyEmailInput } from "../dto/verify-email.dto.js";
import { IdentityTokens } from "../../infrastructure/persistence/tokens/identity.tokens.js";
import type { IVerifyEmailRepository } from "../../domain/repositories/verify-email.repository.js";
import type { ITokenHasher } from "../../domain/services/token-hasher.js";
import { AuthenticationError } from "../../../../shared/errors/AuthenticationError.js";
import type { IUserRepository } from "../../domain/repositories/user.repository.js";

@injectable()
export class VerifyEmailUseCaseImpl implements VerifyEmailUseCase {
  constructor(

    @inject(IdentityTokens.UserRepository)
    private readonly userRepo: IUserRepository,

    @inject(IdentityTokens.VerifyEmailRepository)
    private readonly verifyEmailRepo: IVerifyEmailRepository,

    @inject(IdentityTokens.TokenHasher)
    private readonly tokenHasher: ITokenHasher

  ) { }

  async execute(input: VerifyEmailInput): Promise<void> {
    const token = input.token

    const tokenHash = this.tokenHasher.hash(token)

    const verifyEmail = await this.verifyEmailRepo.findByToken(tokenHash)

    if (!verifyEmail) {
      throw new AuthenticationError("Invalid verification token")
    }

    const user = await this.userRepo.findById(verifyEmail.getUserId())

    if (!user) {
      throw new AuthenticationError("User not found")
    }

    if (verifyEmail.getVerifiedAt()) {
      throw new AuthenticationError("Verified token already used")
    }

    const now = new Date()

    if (verifyEmail.getExpiresAt() < now) {
      throw new AuthenticationError("Verification token has expired.")
    }

    await this.verifyEmailRepo.updateVerifiedAt(verifyEmail.getId(), now)

    user.verifyEmail()

    await this.userRepo.update(user)
  }
}
