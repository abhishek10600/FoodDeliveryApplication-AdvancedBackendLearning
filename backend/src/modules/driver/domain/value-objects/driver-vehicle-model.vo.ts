import { DriverDomainError } from "../errors/driver-domain.error.js"

export class DriverVehicleModel {

  private static readonly DRIVER_VEHICLE_MODEL_MIN: number = 1
  private static readonly DRIVER_VEHICLE_MODEL_MAX: number = 100

  private readonly value: string

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): DriverVehicleModel {
    const normalizedValue = DriverVehicleModel.normalize(value)

    DriverVehicleModel.validate(normalizedValue)

    return new DriverVehicleModel(normalizedValue)
  }

  public static normalize(value: string): string {

    if (typeof (value) !== "string") {
      throw new DriverDomainError("Driver vehicle model must be a string", 400)
    }

    return value.trim().replace(/\s+/g, " ")

  }

  public static validate(normalizedValue: string): void {
    if (normalizedValue.length < this.DRIVER_VEHICLE_MODEL_MIN) {
      throw new DriverDomainError(`Driver vehicle model must be at least ${this.DRIVER_VEHICLE_MODEL_MIN}`, 400)
    }

    if (normalizedValue.length > this.DRIVER_VEHICLE_MODEL_MAX) {
      throw new DriverDomainError(`Driver vehicle model cannot contain more than ${this.DRIVER_VEHICLE_MODEL_MAX} characters`, 400)
    }
  }

  public getValue(): string {
    return this.value
  }

  public equals(other: DriverVehicleModel): boolean {
    return other.value === this.value
  }

  public toString(): string {
    return this.value
  }
}
