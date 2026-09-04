import { injectable, inject } from "tsyringe"
import { IdentityTokens } from "../../../identity/infrastructure/persistence/tokens/identity.tokens.js";
import type { IUserRepository } from "../../../identity/domain/repositories/user.repository.js";
import { CustomerTokens } from "../../infrastructure/persistence/tokens/customer.tokens.js";
import type { ICustomerRepository } from "../../domain/repositories/customer.repository.js";
import { InfrastructureTokens } from "../../../../infrastructure/container/index.js";
import type { FileStorage } from "../../../../shared/contracts/storage/file-storage.js";
import { CustomerAvatarUploadWithoutStreamUseCase } from "./customer-avatar-upload-without-stream.use-case.js";
import { CustomerAvatarUploadWithoutStreamInput } from "../dto/customer-avatar-upload-without-stream.dto.js";
import { AuthenticationError } from "../../../../shared/errors/AuthenticationError.js";
import { CustomerNotFoundError } from "../../domain/errors/customer-not-found.error.js";
import { validateCustomerAvatar } from "../../validators/customer-avatar.validator.js";
import { CustomerAvatarUrl } from "../../domain/value-objects/customer-avatar.vo.js";

@injectable()
export class CustomerAvatarUploadWithoutStreamUseCaseImpl implements CustomerAvatarUploadWithoutStreamUseCase {

  constructor(

    @inject(IdentityTokens.UserRepository)
    private readonly useRepo: IUserRepository,

    @inject(CustomerTokens.CustomerRepository)
    private readonly customerRepo: ICustomerRepository,

    @inject(InfrastructureTokens.FileStorage)
    private readonly fileStorage: FileStorage

  ) { }

  async execute(input: CustomerAvatarUploadWithoutStreamInput): Promise<void> {

    const userId = input.userId

    validateCustomerAvatar(input.file)

    const user = await this.useRepo.findById(userId)

    if (!user) {
      throw new AuthenticationError("User not found")
    }

    const customer = await this.customerRepo.findByUserId(userId)

    if (!customer) {
      throw new CustomerNotFoundError()
    }

    const filename = input.file.originalname
    const extension = this.getExtension(filename)

    const key = `customers/${input.userId}/avatar/${crypto.randomUUID()}${extension}`

    const response = await this.fileStorage.upload({
      key,
      body: input.file.buffer,
      contentType: input.file.mimetype,
      contentLength: input.file.size
    })

    const avatarUrl = response.url

    customer.changeAvatarUrl(CustomerAvatarUrl.create(avatarUrl))

    await this.customerRepo.update(customer);

  }

  private getExtension(filename: string): string {
    const index = filename.lastIndexOf(".");

    if (index === -1) {
      return "";
    }

    return filename.slice(index).toLowerCase()
  }

}
