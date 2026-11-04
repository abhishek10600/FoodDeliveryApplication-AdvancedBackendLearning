import { inject, injectable } from "tsyringe"
import { AddressSetDefaultUseCase } from "./address-set-default.use-case.js";
import { CustomerTokens } from "../../../customer/infrastructure/persistence/tokens/customer.tokens.js";
import type { ICustomerRepository } from "../../../customer/domain/repositories/customer.repository.js";
import { AddressTokens } from "../../infrastructure/persistence/tokens/address-tokens.js";
import type { IAddressRepository } from "../../domain/repositories/address.repository.js";
import { AddressSetDefaultInput } from "../dto/address-set-default.dto.js";
import { CustomerNotFoundError } from "../../../customer/domain/errors/customer-not-found.error.js";
import { AddressDomainError } from "../../domain/errors/address-domain.error.js";

@injectable()
export class AddressSetDefaultUseCaseImpl implements AddressSetDefaultUseCase {
  constructor(

    @inject(CustomerTokens.CustomerRepository)
    private readonly customerRepo: ICustomerRepository,

    @inject(AddressTokens.AddressRepository)
    private readonly addressRepo: IAddressRepository

  ) { }

  async execute(input: AddressSetDefaultInput): Promise<void> {
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

    const currentDefaultAddress = await this.addressRepo.findDefaultAddressByCustomerId(customer.getId())

    if (!currentDefaultAddress) {
      address.updateIsDefault()

      await this.addressRepo.update(input.id, address)

      return
    }

    if (currentDefaultAddress.getId() === address.getId()) {
      address.updateIsDefault()

      await this.addressRepo.update(input.id, address)

      return
    }

    currentDefaultAddress.updateIsDefault()

    await this.addressRepo.update(currentDefaultAddress.getId(), currentDefaultAddress)

    address.updateIsDefault()

    await this.addressRepo.update(input.id, address)
  }
}
