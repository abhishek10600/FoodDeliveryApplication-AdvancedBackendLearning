import { AddressDomainError } from "../errors/address-domain.error.js"

export class AddressCountry {

  private static ADDRESS_COUNTRY_MIN: number = 1
  private static ADDRESS_COUNTRY_MAX: number = 100

  private readonly value: string

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): AddressCountry {

    const normalizedValue = AddressCountry.normalize(value)

    AddressCountry.validate(normalizedValue)

    return new AddressCountry(value)

  }

  public static normalize(value: string): string {

    if (typeof (value) !== "string") {
      throw new AddressDomainError("country must be a string", 400)
    }

    return value.trim().replace(/\s+/g, " ")

  }

  public static validate(normalizedValue: string): void {

    if (normalizedValue.length < this.ADDRESS_COUNTRY_MIN) {
      throw new AddressDomainError(`country cannot be less than ${this.ADDRESS_COUNTRY_MIN} characters`, 400)
    }

    if (normalizedValue.length > this.ADDRESS_COUNTRY_MAX) {
      throw new AddressDomainError(`country cannot contain more than ${this.ADDRESS_COUNTRY_MAX} characters`, 400)
    }

  }

  public getValue(): string {
    return this.value
  }

  public equals(other: AddressCountry): boolean {
    return other.getValue() === this.value
  }

  public toString(): string {
    return this.value
  }
}
