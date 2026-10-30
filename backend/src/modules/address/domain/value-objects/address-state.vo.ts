import { AddressDomainError } from "../errors/address-domain.error.js"

export class AddressState {

  private static ADDRESS_STATE_MIN: number = 1
  private static ADDRESS_STATE_MAX: number = 100

  private readonly value: string

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): AddressState {

    const normalizedValue = AddressState.normalize(value)

    AddressState.validate(normalizedValue)

    return new AddressState(value)

  }

  public static normalize(value: string): string {

    if (typeof (value) !== "string") {
      throw new AddressDomainError("house name must be a string", 400)
    }

    return value.trim().replace(/\s+/g, " ")

  }

  public static validate(normalizedValue: string): void {

    if (normalizedValue.length < this.ADDRESS_STATE_MIN) {
      throw new AddressDomainError(`state cannot be less than ${this.ADDRESS_STATE_MIN} characters`, 400)
    }

    if (normalizedValue.length > this.ADDRESS_STATE_MAX) {
      throw new AddressDomainError(`state cannot contain more than ${this.ADDRESS_STATE_MAX} characters`, 400)
    }

  }

  public getValue(): string {
    return this.value
  }

  public equals(other: AddressState): boolean {
    return other.getValue() === this.value
  }

  public toString(): string {
    return this.value
  }
}
