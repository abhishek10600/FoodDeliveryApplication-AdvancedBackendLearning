import { AddressSetDefaultInput } from "../dto/address-set-default.dto.js";

export interface AddressSetDefaultUseCase {
  execute(input: AddressSetDefaultInput): Promise<void>
}
