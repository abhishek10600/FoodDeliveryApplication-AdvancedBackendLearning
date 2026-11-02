import { injectable, inject } from "tsyringe"
import { AddressCreationUseCase } from "./address-creation.use-case.js";
import { AddressTokens } from "../../infrastructure/persistence/tokens/address-tokens.js";
import type { IAddressRepository } from "../../domain/repositories/address.repository.js";
import { AddressResult } from "../dto/address-result.dto.js";
import { CreateAddressInput } from "../dto/create-address.dto.js";
import { CustomerTokens } from "../../../customer/infrastructure/persistence/tokens/customer.tokens.js";
import type { ICustomerRepository } from "../../../customer/domain/repositories/customer.repository.js";
import { CustomerNotFoundError } from "../../../customer/domain/errors/customer-not-found.error.js";
import { Address } from "../../domain/entities/address.entity.js";
import { AddressHouseName } from "../../domain/value-objects/address-house-name.vo.js";
import { AddressStreetName } from "../../domain/value-objects/address-street-name.vo.js";
import { AddressLandmark } from "../../domain/value-objects/address-landmark.vo.js";
import { AddressCity } from "../../domain/value-objects/address-city.vo.js";
import { AddressState } from "../../domain/value-objects/address-state.vo.js";
import { AddressCountry } from "../../domain/value-objects/address-country.vo.js";
import { AddressPin } from "../../domain/value-objects/address-pin.vo.js";
import { AddressResultMapper } from "../dto/mapper/address-result.mapper.js";

@injectable()
export class AddressCreationUseCaseImpl implements AddressCreationUseCase {
  constructor(

    @inject(CustomerTokens.CustomerRepository)
    private readonly customerRepo: ICustomerRepository,

    @inject(AddressTokens.AddressRepository)
    private readonly addressRepo: IAddressRepository

  ) { }

  async execute(input: CreateAddressInput): Promise<AddressResult> {
    const customer = await this.customerRepo.findByUserId(input.userId)

    if (!customer) {
      throw new CustomerNotFoundError("Customer not found")
    }

    const customerId = customer.getId()

    const addressEntity = Address.create({
      customerId,
      houseName: AddressHouseName.create(input.houseName),
      streetName: AddressStreetName.create(input.streetName),
      landmark: input.landMark ? AddressLandmark.create(input.landMark): undefined,
      city: AddressCity.create(input.city),
      state: AddressState.create(input.state),
      country: AddressCountry.create(input.country),
      pin: AddressPin.create(input.pin)
    })

    const createdAddress = await this.addressRepo.create(addressEntity)

    return AddressResultMapper.toResult(createdAddress)
  }
}
