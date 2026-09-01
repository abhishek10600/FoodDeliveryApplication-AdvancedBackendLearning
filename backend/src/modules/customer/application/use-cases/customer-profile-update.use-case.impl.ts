import { injectable, inject } from "tsyringe"
import { CustomerProfileUpdateResult } from "../dto/customer-profile-update-result.dto.js";
import { CustomerProfileUpdateInput } from "../dto/customer-profile-update.dto.js";
import { CustomerProfileUpdateUseCase } from "./customer-profile-update.use-case.js";
import { CustomerTokens } from "../../infrastructure/persistence/tokens/customer.tokens.js";
import type { ICustomerRepository } from "../../domain/repositories/customer.repository.js";
import { IdentityTokens } from "../../../identity/infrastructure/persistence/tokens/identity.tokens.js";
import type { IUserRepository } from "../../../identity/domain/repositories/user.repository.js";
import { AuthenticationError } from "../../../../shared/errors/AuthenticationError.js";
import { CustomerNotFoundError } from "../../domain/errors/customer-not-found.error.js";
import { CustomerFirstName } from "../../domain/value-objects/customer-first-name.vo.js";
import { CustomerLastName } from "../../domain/value-objects/customer-last-name.vo.js";
import { CustomerPhoneNumber } from "../../domain/value-objects/customer-phone.vo.js";

@injectable()
export class CustomerProfileUpdateUseCaseImpl implements CustomerProfileUpdateUseCase {
  constructor(

    @inject(CustomerTokens.CustomerRepository)
    private readonly customerRepo: ICustomerRepository,

    @inject(IdentityTokens.UserRepository)
    private readonly userRepo: IUserRepository

  ) { }

  async execute(input: CustomerProfileUpdateInput): Promise<CustomerProfileUpdateResult> {

    const userId = input.userId

    const user = await this.userRepo.findById(userId)

    if (!user) {
      throw new AuthenticationError("User not found");
    }

    const customer = await this.customerRepo.findByUserId(userId)

    if (!customer) {
      throw new CustomerNotFoundError()
    }

    if (input.firstName) {
      customer.updateCustomerProfile({
        firstName: CustomerFirstName.create(input.firstName)
      })
    }

    if (input.lastName) {
      customer.updateCustomerProfile({
        lastName: CustomerLastName.create(input.lastName)
      })
    }

    if (input.phone) {
      customer.updateCustomerProfile({
        phone: CustomerPhoneNumber.create(input.phone)
      })
    }

    const updatedCustomerProfile = await this.customerRepo.update(customer)

    return {

      customerId: updatedCustomerProfile.getId(),
      userId: updatedCustomerProfile.getUserId(),
      firstName: updatedCustomerProfile.getFirstName().getValue(),
      lastName: updatedCustomerProfile.getLastName().getValue(),
      phone: updatedCustomerProfile.getPhone().getValue(),
      avatarUrl: updatedCustomerProfile.getAvatarUrl()?.getValue() ?? null,
      preferences: updatedCustomerProfile.getPreferences().toPrimitives(),
      createdAt: updatedCustomerProfile.getCreatedAt(),
      updatedAt: updatedCustomerProfile.getUpdatedAt()

    }

  }
}
