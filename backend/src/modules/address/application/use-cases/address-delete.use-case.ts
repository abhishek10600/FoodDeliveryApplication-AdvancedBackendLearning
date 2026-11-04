import { AddressByIdInput } from "../dto/address-by-id.dto.js";

export interface AddressDeleteUseCase {
  execute(input: AddressByIdInput): Promise<void>
}
