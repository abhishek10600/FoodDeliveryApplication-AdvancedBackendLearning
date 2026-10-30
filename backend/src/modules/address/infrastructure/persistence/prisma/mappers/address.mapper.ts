import { Prisma } from "../../../../../../../generated/prisma/client.js"
import { Address } from "../../../../domain/entities/address.entity.js";
import { AddressCity } from "../../../../domain/value-objects/address-city.vo.js";
import { AddressCountry } from "../../../../domain/value-objects/address-country.vo.js";
import { AddressHouseName } from "../../../../domain/value-objects/address-house-name.vo.js";
import { AddressLandmark } from "../../../../domain/value-objects/address-landmark.vo.js";
import { AddressPin } from "../../../../domain/value-objects/address-pin.vo.js";
import { AddressState } from "../../../../domain/value-objects/address-state.vo.js";
import { AddressStreetName } from "../../../../domain/value-objects/address-street-name.vo.js";

export class AddressMapper {
  public static toDomain(data: Prisma.AddressGetPayload<{}>): Address {
    return Address.rehydrate({
      id: data.id,
      customerId: data.customerId,
      houseName: AddressHouseName.create(data.houseName),
      streetName: AddressStreetName.create(data.streetName),
      landmark: data.landmark ? AddressLandmark.create(data.landmark) : undefined,
      city: AddressCity.create(data.city),
      state: AddressState.create(data.state),
      country: AddressCountry.create(data.country),
      pin: AddressPin.create(data.pin),
      isDefault: data.isDefault,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    })
  }

  public static toPersistence(address: Address): Prisma.AddressCreateInput {
    return {
      id: address.getId(),
      customer: {
        connect: {
          id: address.getCustomerId()
        }
      },
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

  public static toUpdatePersistence(address: Address): Prisma.AddressUpdateInput {
    return {
      id: address.getId(),
      customer: {
        connect: {
          id: address.getCustomerId()
        }
      },
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
