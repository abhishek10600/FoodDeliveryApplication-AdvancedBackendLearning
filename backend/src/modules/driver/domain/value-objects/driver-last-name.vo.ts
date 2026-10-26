import { DriverDomainError } from "../errors/driver-domain.error.js"

export class DriverLastName {

  private static readonly DRIVER_LAST_NAME_MIN: number = 1
  private static readonly DRIVER_LAST_NAME_MAX: number = 100

  private readonly value: string

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): DriverLastName {

    const normalizedValue = DriverLastName.normalize(value)

    DriverLastName.validate(normalizedValue)

    return new DriverLastName(normalizedValue)

  }

  public static normalize(value: string): string {

    if (typeof (value) !== "string") {
      throw new DriverDomainError("Driver last name must be a string", 400)
    }

    return value.trim().replace(/\s+/g, " ")
  }

  public static validate(normalizedValue: string): void {
    if (normalizedValue.length < DriverLastName.DRIVER_LAST_NAME_MIN) {
      throw new DriverDomainError(`Driver last name must contain at least ${DriverLastName.DRIVER_LAST_NAME_MIN} characters`, 400)
    }

    if (normalizedValue.length > DriverLastName.DRIVER_LAST_NAME_MAX) {
      throw new DriverDomainError(`Driver last name cannot contain more than ${DriverLastName.DRIVER_LAST_NAME_MAX} characters`, 400)
    }
  }

  public getValue(): string {
    return this.value
  }

  public equals(other: DriverLastName): boolean {
    return other.getValue() === this.value
  }

  public toString(): string {
    return this.value
  }
}
