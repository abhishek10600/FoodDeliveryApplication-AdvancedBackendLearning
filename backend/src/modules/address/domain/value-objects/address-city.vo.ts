import { AddressDomainError } from "../errors/address-domain.error.js"

export class AddressCity {

  private static ADDRESS_CITY_MIN: number = 1
  private static ADDRESS_CITY_MAX: number = 100

  private readonly value: string

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): AddressCity {

    const normalizedValue = AddressCity.normalize(value)

    AddressCity.validate(normalizedValue)

    return new AddressCity(value)

  }

  public static normalize(value: string): string {

    if (typeof (value) !== "string") {
      throw new AddressDomainError("city must be a string", 400)
    }

    return value.trim().replace(/\s+/g, " ")

  }

  public static validate(normalizedValue: string): void {

    if (normalizedValue.length < this.ADDRESS_CITY_MIN) {
      throw new AddressDomainError(`city cannot be less than ${this.ADDRESS_CITY_MIN} characters`, 400)
    }

    if (normalizedValue.length > this.ADDRESS_CITY_MAX) {
      throw new AddressDomainError(`city cannot contain more than ${this.ADDRESS_CITY_MAX} characters`, 400)
    }

  }

  public getValue(): string {
    return this.value
  }

  public equals(other: AddressCity): boolean {
    return other.getValue() === this.value
  }

  public toString(): string {
    return this.value
  }
}
