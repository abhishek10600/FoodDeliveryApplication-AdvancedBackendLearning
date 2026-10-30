import { AddressDomainError } from "../errors/address-domain.error.js"

export class AddressPin {

  private static ADDRESS_PIN_MIN: number = 4
  private static ADDRESS_PIN_MAX: number = 100

  private readonly value: string

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): AddressPin {

    const normalizedValue = AddressPin.normalize(value)

    AddressPin.validate(normalizedValue)

    return new AddressPin(value)

  }

  public static normalize(value: string): string {

    if (typeof (value) !== "string") {
      throw new AddressDomainError("house name must be a string", 400)
    }

    return value.trim().replace(/\s+/g, " ")

  }

  public static validate(normalizedValue: string): void {

    if (normalizedValue.length < this.ADDRESS_PIN_MIN) {
      throw new AddressDomainError(`pin cannot be less than ${this.ADDRESS_PIN_MIN} characters`, 400)
    }

    if (normalizedValue.length > this.ADDRESS_PIN_MAX) {
      throw new AddressDomainError(`pin cannot contain more than ${this.ADDRESS_PIN_MAX} characters`, 400)
    }

  }

  public getValue(): string {
    return this.value
  }

  public equals(other: AddressPin): boolean {
    return other.getValue() === this.value
  }

  public toString(): string {
    return this.value
  }
}
