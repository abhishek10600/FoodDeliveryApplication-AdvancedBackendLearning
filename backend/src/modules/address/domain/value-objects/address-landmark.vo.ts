import { AddressDomainError } from "../errors/address-domain.error.js"

export class AddressLandmark {

  private static ADDRESS_LANDMARK_MIN: number = 1
  private static ADDRESS_LANDMARK_MAX: number = 100

  private readonly value: string

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): AddressLandmark {

    const normalizedValue = AddressLandmark.normalize(value)

    AddressLandmark.validate(normalizedValue)

    return new AddressLandmark(value)

  }

  public static normalize(value: string): string {

    if (typeof (value) !== "string") {
      throw new AddressDomainError("landmark must be a string", 400)
    }

    return value.trim().replace(/\s+/g, " ")

  }

  public static validate(normalizedValue: string): void {

    if (normalizedValue.length < this.ADDRESS_LANDMARK_MIN) {
      throw new AddressDomainError(`landmark cannot be less than ${this.ADDRESS_LANDMARK_MIN} characters`, 400)
    }

    if (normalizedValue.length > this.ADDRESS_LANDMARK_MAX) {
      throw new AddressDomainError(`landmark cannot contain more than ${this.ADDRESS_LANDMARK_MAX} characters`, 400)
    }

  }

  public getValue(): string {
    return this.value
  }

  public equals(other: AddressLandmark): boolean {
    return other.getValue() === this.value
  }

  public toString(): string {
    return this.value
  }
}
