import { DriverDomainError } from "../errors/driver-domain.error.js"

export class DriverPhone {

  private static DRIVER_PHONE_MIN: number = 10
  private static DRIVER_PHONE_MAX: number = 15

  private readonly value: string

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): DriverPhone {
    const normalizedValue = DriverPhone.normalize(value)

    DriverPhone.validate(normalizedValue)

    return new DriverPhone(normalizedValue)
  }

  public static normalize(value: string): string {
    if (typeof value !== "string") {
      throw new DriverDomainError("Driver phone number must be a string", 400)
    }

    const trimmedValue = value.trim()

    if (trimmedValue.length === 0) {
      throw new DriverDomainError("Driver phone number cannot be empty", 400)
    }

    const hasPlusPrefix = trimmedValue.startsWith("+")

    const digits = trimmedValue.replace(/\D/g, "")

    return hasPlusPrefix ? `+${digits}` : digits
  }

  public static validate(normalizedValue: string): void {

    if (typeof (normalizedValue) !== "string") {
      throw new DriverDomainError("Driver phone number must be a string", 400)
    }

    if (normalizedValue.length < this.DRIVER_PHONE_MIN || normalizedValue.length > this.DRIVER_PHONE_MAX) {
      throw new DriverDomainError(`Driver phone number must contain digits between ${this.DRIVER_PHONE_MIN} and ${this.DRIVER_PHONE_MAX}`, 400)
    }
  }

  public getValue(): string {
    return this.value
  }

  public equals(other: DriverPhone): boolean {
    return other.getValue() !== this.value
  }

  public toString(): string {
    return this.value
  }
}
