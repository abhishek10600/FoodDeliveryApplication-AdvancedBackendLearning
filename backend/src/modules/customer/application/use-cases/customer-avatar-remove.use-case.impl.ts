import { injectable, inject } from "tsyringe";
import { CustomerAvatarRemoveUseCase } from "./customer-avatar-remove.use-case.js";
import { IdentityTokens } from "../../../identity/infrastructure/persistence/tokens/identity.tokens.js";
import type { IUserRepository } from "../../../identity/domain/repositories/user.repository.js";
import { CustomerTokens } from "../../infrastructure/persistence/tokens/customer.tokens.js";
import type { ICustomerRepository } from "../../domain/repositories/customer.repository.js";
import { InfrastructureTokens } from "../../../../infrastructure/container/index.js";
import type { FileStorage } from "../../../../shared/contracts/storage/file-storage.js";
import { AuthenticationError } from "../../../../shared/errors/AuthenticationError.js";
import { CustomerNotFoundError } from "../../domain/errors/customer-not-found.error.js";

@injectable()
export class CustomerAvatarRemoveUseCaseImpl implements CustomerAvatarRemoveUseCase {

  constructor(

    @inject(IdentityTokens.UserRepository)
    private readonly userRepo: IUserRepository,

    @inject(CustomerTokens.CustomerRepository)
    private readonly customerRepo: ICustomerRepository,

    @inject(InfrastructureTokens.FileStorage)
    private readonly fileStorage: FileStorage

  ) { }

  async execute(input: { userId: string; }): Promise<void> {
    const userId = input.userId

    const user = await this.userRepo.findById(userId)

    if (!user) {
      throw new AuthenticationError("User not found")
    }

    const customer = await this.customerRepo.findByUserId(userId)

    if (!customer) {
      throw new CustomerNotFoundError()
    }

    const avatarUrl = customer.getAvatarUrl()

    if (!avatarUrl) {
      return;
    }

    const avatarUrlValue = avatarUrl.getValue()

    if (!avatarUrlValue) {
      return;
    }

    const avatarKey = this.extractStorageKey(avatarUrlValue)

    customer.removeAvatarUrl()

    await this.customerRepo.update(customer)

    if (avatarKey) {
      try {
        await this.fileStorage.delete(avatarKey)
      } catch { }
    }

  }

  private extractStorageKey(avatarUrl: string): string | null {
    try {
      const url = new URL(avatarUrl);

      const key = url.pathname.replace(/^\/+/, "");

      return key ? decodeURIComponent(key) : null;
    } catch {
      return null;
    }
  }
}
