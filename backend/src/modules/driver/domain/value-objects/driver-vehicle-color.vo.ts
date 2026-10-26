import { DriverDomainError } from "../errors/driver-domain.error.js"

export class DriverVehicleColor {

  private static readonly DRIVER_VEHICLE_COLOR_MIN: number = 1
  private static readonly DRIVER_VEHICLE_COLOR_MAX: number = 100

  private readonly value: string

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): DriverVehicleColor {
    const normalizedValue = DriverVehicleColor.normalize(value)

    DriverVehicleColor.validate(normalizedValue)

    return new DriverVehicleColor(normalizedValue)
  }

  public static normalize(value: string): string {

    if (typeof (value) !== "string") {
      throw new DriverDomainError("Driver vehicle color must be a string", 400)
    }

    return value.trim().replace(/\s+/g, " ")

  }

  public static validate(normalizedValue: string): void {
    if (normalizedValue.length < this.DRIVER_VEHICLE_COLOR_MIN) {
      throw new DriverDomainError(`Driver vehicle color must be at least ${this.DRIVER_VEHICLE_COLOR_MIN}`, 400)
    }

    if (normalizedValue.length > this.DRIVER_VEHICLE_COLOR_MAX) {
      throw new DriverDomainError(`Driver vehicle color cannot contain more than ${this.DRIVER_VEHICLE_COLOR_MAX} characters`, 400)
    }
  }

  public getValue(): string {
    return this.value
  }

  public equals(other: DriverVehicleColor): boolean {
    return other.value === this.value
  }

  public toString(): string {
    return this.value
  }
}
