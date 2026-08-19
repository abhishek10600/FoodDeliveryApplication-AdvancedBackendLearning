import { injectable, inject } from "tsyringe";
import { LogoutUserUseCase } from "./logout-user.use-case.js";
import { IdentityTokens } from "../../infrastructure/persistence/tokens/identity.tokens.js";
import type { IRefreshSessionRepository } from "../../domain/repositories/refresh-session.repository.js";
import { LogoutUserInput } from "../dto/logout-user-dto.js";
import type { ITokenHasher } from "../../domain/services/token-hasher.js";
import { RefreshSessionNotFound } from "../../domain/errors/refresh-session-not-found.error.js";

@injectable()
export class LogoutUserUseCaseImpl implements LogoutUserUseCase {
  constructor(

    @inject(IdentityTokens.RefreshSessionRepository)
    private readonly refreshSessionRepo: IRefreshSessionRepository,

    @inject(IdentityTokens.TokenHasher)
    private readonly tokenHasher: ITokenHasher

  ) { }

  async execute(input: LogoutUserInput): Promise<void> {

    const tokenHash = this.tokenHasher.hash(input.refreshToken)

    const refreshSession = await this.refreshSessionRepo.findByTokenHash(tokenHash)

    if (!refreshSession) {
      throw new RefreshSessionNotFound()
    }

    await this.refreshSessionRepo.revokeByTokenHash(tokenHash , new Date())

  }
}
