import { AddressUpdateInput } from "../dto/address-update.dto.js";

export interface AddressUpdateUseCase {
  execute(input: AddressUpdateInput): Promise<void>
}
