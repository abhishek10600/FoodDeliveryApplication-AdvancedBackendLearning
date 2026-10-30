import { AddressDomainError } from "../errors/address-domain.error.js"

export class AddressStreetName {

  private static ADDRESS_STREET_NAME_MIN: number = 1
  private static ADDRESS_STREET_NAME_MAX: number = 100

  private readonly value: string

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): AddressStreetName {

    const normalizedValue = AddressStreetName.normalize(value)

    AddressStreetName.validate(normalizedValue)

    return new AddressStreetName(value)

  }

  public static normalize(value: string): string {

    if (typeof (value) !== "string") {
      throw new AddressDomainError("street name must be a string", 400)
    }

    return value.trim().replace(/\s+/g, " ")

  }

  public static validate(normalizedValue: string): void {

    if (normalizedValue.length < this.ADDRESS_STREET_NAME_MIN) {
      throw new AddressDomainError(`street name cannot be less than ${this.ADDRESS_STREET_NAME_MIN} characters`, 400)
    }

    if (normalizedValue.length > this.ADDRESS_STREET_NAME_MAX) {
      throw new AddressDomainError(`street name cannot contain more than ${this.ADDRESS_STREET_NAME_MAX} characters`, 400)
    }

  }

  public getValue(): string {
    return this.value
  }

  public equals(other: AddressStreetName): boolean {
    return other.getValue() === this.value
  }

  public toString(): string {
    return this.value
  }
}
