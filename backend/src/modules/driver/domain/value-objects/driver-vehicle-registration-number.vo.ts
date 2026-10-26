import { DriverDomainError } from "../errors/driver-domain.error.js"

export class DriverVehicleRegistrationNumber {

  private static readonly DRIVER_VEHICLE_REGNO_MIN: number = 1

  private readonly value: string

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): DriverVehicleRegistrationNumber {
    const normalizedValue = DriverVehicleRegistrationNumber.normalize(value)

    DriverVehicleRegistrationNumber.validate(normalizedValue)

    return new DriverVehicleRegistrationNumber(normalizedValue)
  }

  public static normalize(value: string): string {

    if (typeof (value) !== "string") {
      throw new DriverDomainError("Driver vehicle registratio number must be a string", 400)
    }

    return value.trim().replace(/\s+/g, " ")

  }

  public static validate(normalizedValue: string): void {
    if (normalizedValue.length < this.DRIVER_VEHICLE_REGNO_MIN) {
      throw new DriverDomainError(`Driver vehicle registration number must be at least ${this.DRIVER_VEHICLE_REGNO_MIN}`, 400)
    }
  }

  public getValue(): string {
    return this.value
  }

  public equals(other: DriverVehicleRegistrationNumber): boolean {
    return other.value === this.value
  }

  public toString(): string {
    return this.value
  }
}
