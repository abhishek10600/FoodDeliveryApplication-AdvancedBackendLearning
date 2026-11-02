import { injectable, inject } from "tsyringe"
import { AddressByIdUseCase } from "./address-by-id.use-case.js";
import { CustomerTokens } from "../../../customer/infrastructure/persistence/tokens/customer.tokens.js";
import type { ICustomerRepository } from "../../../customer/domain/repositories/customer.repository.js";
import { AddressTokens } from "../../infrastructure/persistence/tokens/address-tokens.js";
import type { IAddressRepository } from "../../domain/repositories/address.repository.js";
import { AddressByIdInput } from "../dto/address-by-id.dto.js";
import { AddressResult } from "../dto/address-result.dto.js";
import { CustomerNotFoundError } from "../../../customer/domain/errors/customer-not-found.error.js";
import { AddressDomainError } from "../../domain/errors/address-domain.error.js";
import { AddressResultMapper } from "../dto/mapper/address-result.mapper.js";

@injectable()
export class AddressByIdUseCaseImpl implements AddressByIdUseCase {
  constructor(

    @inject(CustomerTokens.CustomerRepository)
    private readonly customerRepo: ICustomerRepository,

    @inject(AddressTokens.AddressRepository)
    private readonly addressRepo: IAddressRepository

  ) { }

  async execute(input: AddressByIdInput): Promise<AddressResult> {
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

    return AddressResultMapper.toResult(address)
  }
}
