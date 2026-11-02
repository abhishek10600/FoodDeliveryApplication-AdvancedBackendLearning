import { injectable, inject } from "tsyringe"
import { AddressListByCustomerUseCase } from "./address-list-by-customer.use-case.js";
import { CustomerTokens } from "../../../customer/infrastructure/persistence/tokens/customer.tokens.js";
import type { ICustomerRepository } from "../../../customer/domain/repositories/customer.repository.js";
import { AddressResult } from "../dto/address-result.dto.js";
import { AddressInput } from "../dto/address.dto.js";
import { AddressTokens } from "../../infrastructure/persistence/tokens/address-tokens.js";
import type { IAddressRepository } from "../../domain/repositories/address.repository.js";
import { CustomerNotFoundError } from "../../../customer/domain/errors/customer-not-found.error.js";
import { AddressResultMapper } from "../dto/mapper/address-result.mapper.js";

@injectable()
export class AddressListByCustomerUseCaseImpl implements AddressListByCustomerUseCase {
  constructor(

    @inject(CustomerTokens.CustomerRepository)
    private readonly customerRepo: ICustomerRepository,

    @inject(AddressTokens.AddressRepository)
    private readonly addressRepo: IAddressRepository

  ) { }

  async execute(input: AddressInput): Promise<AddressResult[]> {
    const customer = await this.customerRepo.findByUserId(input.userId)

    if (!customer) {
      throw new CustomerNotFoundError()
    }

    const customerId = customer.getId()

    const addresses = await this.addressRepo.findByCustomerId(customerId)

    return addresses.map((address) => AddressResultMapper.toResult(address))
  }
}
