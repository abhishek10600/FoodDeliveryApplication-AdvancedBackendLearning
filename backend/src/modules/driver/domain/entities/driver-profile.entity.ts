import { DRIVERAVAILABILITY } from "../enums/driver-availability.enum.js"
import { DRIVERSTATUS } from "../enums/driver-status.enum.js"
import { DriverFirstName } from "../value-objects/driver-first-name.vo.js"
import { DriverLastName } from "../value-objects/driver-last-name.vo.js"
import { DriverPhone } from "../value-objects/driver-phone.vo.js"

export interface IDriverProps {
  id: string
  userId: string
  firstName: DriverFirstName
  lastName: DriverLastName
  phone: DriverPhone
  status: DRIVERSTATUS
  availability: DRIVERAVAILABILITY
  createdAt: Date
  updatedAt: Date
}

export interface ICreateDriverProps {
  userId: string
  firstName: DriverFirstName
  lastName: DriverLastName
  phone: DriverPhone
}

export interface IUpdateDriverProps {
  firstName?: DriverFirstName,
  lastName?: DriverLastName,
  phone?: DriverPhone
}

export class DriverProfile {

  private readonly id: string
  private readonly userId: string
  private firstName: DriverFirstName
  private lastName: DriverLastName
  private phone: DriverPhone
  private status: DRIVERSTATUS
  private availability: DRIVERAVAILABILITY
  private readonly createdAt: Date
  private updatedAt: Date


  private constructor(props: IDriverProps) {
    this.id = props.id
    this.userId = props.userId
    this.firstName = props.firstName
    this.lastName = props.lastName
    this.phone = props.phone
    this.status = props.status
    this.availability = props.availability
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  public static create(props: ICreateDriverProps): DriverProfile {
    const now = new Date()

    return new DriverProfile({
      id: crypto.randomUUID(),
      userId: props.userId,
      firstName: props.firstName,
      lastName: props.lastName,
      phone: props.phone,
      status: DRIVERSTATUS.ACTIVE,
      availability: DRIVERAVAILABILITY.ONLINE,
      createdAt: now,
      updatedAt: now
    })
  }

  public static rehydrate(props: IDriverProps): DriverProfile {
    return new DriverProfile(props)
  }

  public update(props: IUpdateDriverProps): void {
    if (props.firstName !== undefined) {
      this.firstName = props.firstName
    }

    if (props.lastName !== undefined) {
      this.lastName = props.lastName
    }

    if (props.phone !== undefined) {
      this.phone = props.phone
    }

    this.touch()
  }

  public updateAvailability() {
    if (this.availability === DRIVERAVAILABILITY.OFFLINE) {
      this.availability = DRIVERAVAILABILITY.ONLINE
    } else {
      this.availability = DRIVERAVAILABILITY.OFFLINE
    }

    this.touch()
  }

  public getId(): string {
    return this.id
  }

  public getUserId(): string {
    return this.userId
  }

  public getFirstName(): DriverFirstName {
    return this.firstName
  }

  public getLastName(): DriverLastName {
    return this.lastName
  }

  public getPhone(): DriverPhone {
    return this.phone
  }

  public getStatus(): DRIVERSTATUS {
    return this.status
  }

  public getAvailability(): DRIVERAVAILABILITY {
    return this.availability
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
