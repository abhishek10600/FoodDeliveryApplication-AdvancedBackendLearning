import { Address } from "../../../domain/entities/address.entity.js";
import { AddressResult } from "../address-result.dto.js";

export class AddressResultMapper {
  public static toResult(address: Address): AddressResult {
    return {
      id: address.getId(),
      customerId: address.getCustomerId(),
      houseName: address.getHouseName().getValue(),
      streetName: address.getStreetName().getValue(),
      landmark: address.getLandmark()?.getValue(),
      city: address.getCity().getValue(),
      state: address.getState().getValue(),
      country: address.getCountry().getValue(),
      pin: address.getPin().getValue(),
      isDefault: address.getIsDefault(),
      createdAt: address.getCreatedAt(),
      updatedAt: address.getUpdatedAt()
    }
  }
}
