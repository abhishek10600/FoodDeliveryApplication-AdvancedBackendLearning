import { injectable, inject } from "tsyringe"
import { AddressDeleteUseCase } from "./address-delete.use-case.js";
import { CustomerTokens } from "../../../customer/infrastructure/persistence/tokens/customer.tokens.js";
import type { ICustomerRepository } from "../../../customer/domain/repositories/customer.repository.js";
import { AddressTokens } from "../../infrastructure/persistence/tokens/address-tokens.js";
import type { IAddressRepository } from "../../domain/repositories/address.repository.js";
import { AddressByIdInput } from "../dto/address-by-id.dto.js";
import { CustomerNotFoundError } from "../../../customer/domain/errors/customer-not-found.error.js";
import { AddressDomainError } from "../../domain/errors/address-domain.error.js";

@injectable()
export class AddressDeleteUseCaseImpl implements AddressDeleteUseCase {
  constructor(

    @inject(CustomerTokens.CustomerRepository)
    private readonly customerRepo: ICustomerRepository,

    @inject(AddressTokens.AddressRepository)
    private readonly addressRepo: IAddressRepository

  ) { }

  async execute(input: AddressByIdInput): Promise<void> {
    const customer = await this.customerRepo.findByUserId(input.userId)

    if (!customer) {
      throw new CustomerNotFoundError()
    }

    const address = await this.addressRepo.findById(input.id)

    if (!address) {
      throw new AddressDomainError("Address not found", 404)
    }

    if (address.getCustomerId() !== customer.getId()) {
      throw new AddressDomainError("You are not authorized to perform this action", 403)
    }

    if (address.getIsDefault()) {
      throw new AddressDomainError("Default address cannot be deleted. Please make another address as default to delete this address", 400)
    }

    await this.addressRepo.delete(input.id)
  }
}