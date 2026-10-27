import { DRIVERVEHICLETYPE } from "../enums/driver-vehicle-type.enum.js"
import { DriverVehicleColor } from "../value-objects/driver-vehicle-color.vo.js"
import { DriverVehicleMake } from "../value-objects/driver-vehicle-make.vo.js"
import { DriverVehicleModel } from "../value-objects/driver-vehicle-model.vo.js"
import { DriverVehicleRegistrationNumber } from "../value-objects/driver-vehicle-registration-number.vo.js"

export interface IDriverVehicleProps {
  id: string
  driverId: string
  vehicleType: DRIVERVEHICLETYPE
  registrationNumber: DriverVehicleRegistrationNumber
  make: DriverVehicleMake
  color: DriverVehicleColor
  model: DriverVehicleModel
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ICreateDriverVehicleProps {
  driverId: string
  vehicleType: DRIVERVEHICLETYPE
  registrationNumber: DriverVehicleRegistrationNumber
  make: DriverVehicleMake
  color: DriverVehicleColor
  model: DriverVehicleModel
}

export interface IUpdateDriverVehicleProps {
  vehicleType?: DRIVERVEHICLETYPE
  registrationNumber?: DriverVehicleRegistrationNumber
  make?: DriverVehicleMake
  color?: DriverVehicleColor
  model?: DriverVehicleModel
}

export class DriverVehicle {

  private readonly id: string
  private readonly driverId: string
  private vehicleType: DRIVERVEHICLETYPE
  private registrationNumber: DriverVehicleRegistrationNumber
  private make: DriverVehicleMake
  private color: DriverVehicleColor
  private model: DriverVehicleModel
  private isActive: boolean
  private readonly createdAt: Date
  private updatedAt: Date

  constructor(props: IDriverVehicleProps) {
    this.id = props.id
    this.driverId = props.driverId
    this.vehicleType = props.vehicleType
    this.registrationNumber = props.registrationNumber
    this.make = props.make
    this.color = props.color
    this.model = props.model
    this.isActive = props.isActive
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  public static create(props: ICreateDriverVehicleProps): DriverVehicle {
    const now = new Date()

    return new DriverVehicle({
      id: crypto.randomUUID(),
      driverId: props.driverId,
      vehicleType: props.vehicleType,
      registrationNumber: props.registrationNumber,
      make: props.make,
      color: props.color,
      model: props.model,
      isActive: true,
      createdAt: now,
      updatedAt: now
    })
  }

  public static rehydrate(props: IDriverVehicleProps): DriverVehicle {
    return new DriverVehicle(props)
  }

  public update(props: IUpdateDriverVehicleProps): void {
    if (props.vehicleType !== undefined) {
      this.vehicleType = props.vehicleType
    }

    if (props.registrationNumber !== undefined) {
      this.registrationNumber = props.registrationNumber
    }

    if (props.make !== undefined) {
      this.make = props.make
    }

    if (props.model !== undefined) {
      this.model = props.model
    }

    if (props.color !== undefined) {
      this.color = props.color
    }

    this.touch()
  }

  public updateIsActive(): void {
    if (this.isActive) {
      this.isActive = false
    } else {
      this.isActive = true
    }

    this.touch()
  }

  public getId(): string {
    return this.id
  }

  public getDriverId(): string {
    return this.driverId
  }

  public getVehicleType(): DRIVERVEHICLETYPE {
    return this.vehicleType
  }

  public getRegistrationNumber(): DriverVehicleRegistrationNumber {
    return this.registrationNumber
  }

  public getColor(): DriverVehicleColor {
    return this.color
  }

  public getModel(): DriverVehicleModel {
    return this.model
  }

  public getMake(): DriverVehicleMake {
    return this.make
  }

  public getIsActive(): boolean {
    return this.isActive
  }

  public getCreatedAt(): Date {
    return this.createdAt
  }

  public getUpdatedAt(): Date {
    return this.updatedAt
  }

  public touch(): void {
    const now = new Date()

    this.updatedAt = now
  }
}
