import { AddressResult } from "../dto/address-result.dto.js";
import { CreateAddressInput } from "../dto/create-address.dto.js";

export interface AddressCreationUseCase {
  execute(input: CreateAddressInput): Promise<AddressResult>
}
