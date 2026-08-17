import { injectable, inject } from "tsyringe";
import { GetCurrentUserResult } from "../dto/get-current-user-result.dto.js";
import { GetCurrentUserUseCase } from "./get-current-user.user-case.js";
import { IdentityTokens } from "../../infrastructure/persistence/tokens/identity.tokens.js";
import type { IUserRepository } from "../../domain/repositories/user.repository.js";
import { NotFoundError } from "../../../../shared/errors/NotFoundError.js";

@injectable()
export class GetCurrentUserUseCaseImpl implements GetCurrentUserUseCase {
  constructor(

    @inject(IdentityTokens.UserRepository)
    private readonly userRepo: IUserRepository

  ) { }

  async execute(userId: string): Promise<GetCurrentUserResult> {
    const user = await this.userRepo.findById(userId)

    if (!user) {
      throw new NotFoundError("User not found.")
    }

    return {
      userId: user.getId(),
      email: user.getEmail().getValue(),
      roles: user.getRoles(),
      status: user.getStatus(),
      isEmailVerified: user.isEmailVerified(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt()
    }
  }
}
