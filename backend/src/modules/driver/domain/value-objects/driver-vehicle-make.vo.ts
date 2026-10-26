import { DriverDomainError } from "../errors/driver-domain.error.js"

export class DriverVehicleMake {

  private static readonly DRIVER_VEHICLE_MAKE_MIN: number = 1
  private static readonly DRIVER_VEHICLE_MAKE_MAX: number = 100

  private readonly value: string

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): DriverVehicleMake {
    const normalizedValue = DriverVehicleMake.normalize(value)

    DriverVehicleMake.validate(normalizedValue)

    return new DriverVehicleMake(normalizedValue)
  }

  public static normalize(value: string): string {

    if (typeof (value) !== "string") {
      throw new DriverDomainError("Driver vehicle make must be a string", 400)
    }

    return value.trim().replace(/\s+/g, " ")

  }

  public static validate(normalizedValue: string): void {
    if (normalizedValue.length < this.DRIVER_VEHICLE_MAKE_MIN) {
      throw new DriverDomainError(`Driver vehicle make must be at least ${this.DRIVER_VEHICLE_MAKE_MIN}`, 400)
    }

    if (normalizedValue.length > this.DRIVER_VEHICLE_MAKE_MAX) {
      throw new DriverDomainError(`Driver vehicle make cannot contain more than ${this.DRIVER_VEHICLE_MAKE_MAX} characters`, 400)
    }
  }

  public getValue(): string {
    return this.value
  }

  public equals(other: DriverVehicleMake): boolean {
    return other.value === this.value
  }

  public toString(): string {
    return this.value
  }
}
