import { DriverDomainError } from "../errors/driver-domain.error.js"

export class DriverFirstName {

  private static readonly DRIVER_FIRST_NAME_MIN: number = 1
  private static readonly DRIVER_FIRST_NAME_MAX: number = 100

  private readonly value: string

  constructor(value: string) {

    this.value = value

  }

  public static create(value: string): DriverFirstName {
    const normalizedValue = DriverFirstName.normalize(value)

    DriverFirstName.validate(normalizedValue)

    return new DriverFirstName(normalizedValue)
  }

  public static normalize(value: string): string {

    if (typeof (value) !== "string") {
      throw new DriverDomainError("Driver first name must be a string", 400)
    }

    return value.trim().replace(/\s+/g, " ")
  }

  public static validate(normalizedValue: string): void {
    if (normalizedValue.length < DriverFirstName.DRIVER_FIRST_NAME_MIN) {
      throw new DriverDomainError(`Driver first name must contain at least ${DriverFirstName.DRIVER_FIRST_NAME_MIN} characters`, 400)
    }

    if (normalizedValue.length > DriverFirstName.DRIVER_FIRST_NAME_MAX) {
      throw new DriverDomainError(`Driver first name cannot contain more than ${DriverFirstName.DRIVER_FIRST_NAME_MAX} characters`, 400)
    }
  }

  public getValue(): string {
    return this.value
  }

  public equals(other: DriverFirstName): boolean {
    return other.getValue() === this.value
  }

  public toString(): string {
    return this.value
  }
}
