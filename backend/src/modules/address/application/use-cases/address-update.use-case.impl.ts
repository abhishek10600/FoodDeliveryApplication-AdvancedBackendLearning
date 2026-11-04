import { inject, injectable } from "tsyringe"
import { AddressUpdateUseCase } from "./address-update.use-case.js";
import { CustomerTokens } from "../../../customer/infrastructure/persistence/tokens/customer.tokens.js";
import type { ICustomerRepository } from "../../../customer/domain/repositories/customer.repository.js";
import { AddressTokens } from "../../infrastructure/persistence/tokens/address-tokens.js";
import type { IAddressRepository } from "../../domain/repositories/address.repository.js";
import { AddressUpdateInput } from "../dto/address-update.dto.js";
import { CustomerNotFoundError } from "../../../customer/domain/errors/customer-not-found.error.js";
import { AddressDomainError } from "../../domain/errors/address-domain.error.js";
import { AddressHouseName } from "../../domain/value-objects/address-house-name.vo.js";
import { AddressStreetName } from "../../domain/value-objects/address-street-name.vo.js";
import { AddressLandmark } from "../../domain/value-objects/address-landmark.vo.js";
import { AddressCity } from "../../domain/value-objects/address-city.vo.js";
import { AddressState } from "../../domain/value-objects/address-state.vo.js";
import { AddressCountry } from "../../domain/value-objects/address-country.vo.js";
import { AddressPin } from "../../domain/value-objects/address-pin.vo.js";

@injectable()
export class AddressUpdateUseCaseImpl implements AddressUpdateUseCase {
  constructor(

    @inject(CustomerTokens.CustomerRepository)
    private readonly customerRepo: ICustomerRepository,

    @inject(AddressTokens.AddressRepository)
    private readonly addressRepo: IAddressRepository

  ) { }

  async execute(input: AddressUpdateInput): Promise<void> {
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

    address.update({
      houseName: input.houseName ? AddressHouseName.create(input.houseName) : undefined,
      streetName: input.streetName ? AddressStreetName.create(input.streetName) : undefined,
      landmark: input.landmark ? AddressLandmark.create(input.landmark) : undefined,
      city: input.city ? AddressCity.create(input.city) : undefined,
      state: input.state ? AddressState.create(input.state) : undefined,
      country: input.country ? AddressCountry.create(input.country) : undefined,
      pin: input.pin ? AddressPin.create(input.pin) : undefined,
    })

    await this.addressRepo.update(input.id, address)
  }
}
