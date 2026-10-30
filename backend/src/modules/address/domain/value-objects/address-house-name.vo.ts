import { AddressDomainError } from "../errors/address-domain.error.js"

export class AddressHouseName {

  private static ADDRESS_HOUSE_NAME_MIN: number = 1
  private static ADDRESS_HOUSE_NAME_MAX: number = 100

  private readonly value: string

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): AddressHouseName {

    const normalizedValue = AddressHouseName.normalize(value)

    AddressHouseName.validate(normalizedValue)

    return new AddressHouseName(value)

  }

  public static normalize(value: string): string {

    if (typeof (value) !== "string") {
      throw new AddressDomainError("house name must be a string", 400)
    }

    return value.trim().replace(/\s+/g, " ")

  }

  public static validate(normalizedValue: string): void {

    if (normalizedValue.length < this.ADDRESS_HOUSE_NAME_MIN) {
      throw new AddressDomainError(`house name cannot be less than ${this.ADDRESS_HOUSE_NAME_MIN} characters`, 400)
    }

    if (normalizedValue.length > this.ADDRESS_HOUSE_NAME_MAX) {
      throw new AddressDomainError(`house name cannot contain more than ${this.ADDRESS_HOUSE_NAME_MAX} characters`, 400)
    }

  }

  public getValue(): string {
    return this.value
  }

  public equals(other: AddressHouseName): boolean {
    return other.getValue() === this.value
  }

  public toString(): string {
    return this.value
  }
}
