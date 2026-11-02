import { AddressResult } from "../dto/address-result.dto.js";
import { AddressInput } from "../dto/address.dto.js";

export interface AddressListByCustomerUseCase {
  execute(input: AddressInput): Promise<AddressResult[]>
}
