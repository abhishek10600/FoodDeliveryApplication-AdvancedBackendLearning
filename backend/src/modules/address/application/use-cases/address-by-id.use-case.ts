import { AddressByIdInput } from "../dto/address-by-id.dto.js";
import { AddressResult } from "../dto/address-result.dto.js";

export interface AddressByIdUseCase {
  execute(input: AddressByIdInput): Promise<AddressResult>
}
