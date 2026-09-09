import { RestaurantStatus } from "../enums/restaurant-status.enum.js";
import { DayOfWeek } from "../enums/restaurnat-opening-hours.enum.js";
import { RestaurantDomainError } from "../errors/restaurant-domain.error.js";
import { RestaurantCuisine } from "../value-objects/restaurant-cuisine.vo.js";
import { RestaurantDescription } from "../value-objects/restaurant-description.vo.js";
import { RestaurantEmail } from "../value-objects/restaurant-email.vo.js";
import { RestaurantName } from "../value-objects/restaurant-name.vo.js";
import { RestaurantPhone } from "../value-objects/restaurant-phone.vo.js";
import { RestaurantOpeningHours } from "../value-objects/restaurnat-opening-hours.vo.js";

export interface IRestaurantProps {
  id: string;
  ownerId: string;
  name: RestaurantName;
  description: RestaurantDescription;
  phone: RestaurantPhone;
  email: RestaurantEmail;
  status: RestaurantStatus;
  cuisines: RestaurantCuisine[]
  openingHours: RestaurantOpeningHours[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateRestaurantProps {
  ownerId: string;
  name: RestaurantName;
  description: RestaurantDescription;
  phone: RestaurantPhone;
  email: RestaurantEmail;
}

export interface IUpdateRestaurantProfileProps {
  name?: RestaurantName;
  description?: RestaurantDescription;
  phone?: RestaurantPhone;
  email?: RestaurantEmail;
}

export class Restaurant {

  private readonly id: string;
  private readonly ownerId: string;
  private name: RestaurantName;
  private description: RestaurantDescription;
  private phone: RestaurantPhone;
  private email: RestaurantEmail;
  private status: RestaurantStatus;
  private cuisines: RestaurantCuisine[];
  private openingHours: RestaurantOpeningHours[];
  private readonly createdAt: Date;
  private updatedAt: Date;

  private constructor(props: IRestaurantProps) {
    this.id = props.id
    this.ownerId = props.ownerId
    this.name = props.name
    this.description = props.description
    this.phone = props.phone
    this.email = props.email
    this.status = props.status
    this.cuisines = [...props.cuisines]
    this.openingHours = [...props.openingHours]
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt
  }

  public static create(props: ICreateRestaurantProps): Restaurant {
    const now = new Date()

    return new Restaurant({
      id: crypto.randomUUID(),
      ownerId: props.ownerId,
      name: props.name,
      description: props.description,
      phone: props.phone,
      email: props.email,
      status: RestaurantStatus.PENDING,
      cuisines: [],
      openingHours: [],
      createdAt: now,
      updatedAt: now
    })
  }

  public static rehydrate(props: IRestaurantProps): Restaurant {
    return new Restaurant(props)
  }

  public activate(): void {
    if (this.status !== RestaurantStatus.PENDING && this.status !== RestaurantStatus.INACTIVE) {
      throw new RestaurantDomainError(`Restaurant statuc cannot be activated from ${this.status} status`)
    }

    this.status = RestaurantStatus.ACTIVE
    this.touch()
  }

  public deactivate(): void {
    if (this.status !== RestaurantStatus.ACTIVE) {
      throw new RestaurantDomainError(`Restaurant status cannot be deactivate from ${this.status}`)
    }

    this.status = RestaurantStatus.INACTIVE;
    this.touch()
  }

  public suspend(): void {
    if (this.status !== RestaurantStatus.ACTIVE && this.status !== RestaurantStatus.INACTIVE) {
      throw new RestaurantDomainError(`Restaurant cannot be suspended from ${this.status} status`)
    }

    this.status = RestaurantStatus.SUSPENDED
    this.touch()
  }

  public close(): void {
    if (this.status !== RestaurantStatus.ACTIVE && this.status !== RestaurantStatus.INACTIVE && this.status !== RestaurantStatus.SUSPENDED) {
      throw new RestaurantDomainError(`Restaurant cannot be closed from ${this.status} status`)
    }

    this.status = RestaurantStatus.CLOSED
    this.touch()
  }

  public reopen(): void {
    if (this.status !== RestaurantStatus.INACTIVE && this.status !== RestaurantStatus.SUSPENDED) {
      throw new RestaurantDomainError(`Restaurant cannot be reopened from ${this.status} status`)
    }

    this.status = RestaurantStatus.ACTIVE
    this.touch()
  }

  public updateProfile(props: IUpdateRestaurantProfileProps): void {
    if (this.status === RestaurantStatus.CLOSED) {
      throw new RestaurantDomainError("Closed restaurant profile cannot be updated")
    }

    if (props.name !== undefined) {
      this.name = props.name
    }

    if (props.description !== undefined) {
      this.description = props.description
    }

    if (props.phone !== undefined) {
      this.phone = props.phone
    }

    if (props.email !== undefined) {
      this.email = props.email
    }

    this.touch()
  }

  public addCuisine(cuisine: RestaurantCuisine): void {
    const alreadyExists = this.cuisines.some((existingCuisine) => existingCuisine.equals(cuisine))

    if (alreadyExists) {
      throw new RestaurantDomainError(`Cuisine "${cuisine.getValue()}" already exists for this restaurant`)
    }

    this.cuisines.push(cuisine)
    this.touch()
  }

  public removeCuisine(cuisine: RestaurantCuisine): void {
    const index = this.cuisines.findIndex((existingCuisine) => existingCuisine.equals(cuisine))

    if (index === -1) {
      throw new RestaurantDomainError(`Cuisine "${cuisine.getValue()}" does not exists for this restaurant`)
    }

    this.cuisines.splice(index, 1)
    this.touch()
  }

  public updateOpeningHours(openingHours: RestaurantOpeningHours): void {
    const dayOfWeek = openingHours.getDayOfWeek()

    const existingIndex = this.openingHours.findIndex((hours) => hours.getDayOfWeek() === dayOfWeek)

    if (existingIndex === -1) {
      this.openingHours.push(openingHours)
    } else {
      this.openingHours[existingIndex] = openingHours
    }

    this.touch()
  }

  public removeOpeningHours(dayOfWeek: DayOfWeek): void {
    const index = this.openingHours.findIndex((hours) => hours.getDayOfWeek() === dayOfWeek)

    if (index === -1) {
      throw new RestaurantDomainError(`Opening hours for day ${dayOfWeek} do not exist`)
    }

    this.openingHours.splice(index, 1)
    this.touch()
  }

  public setOpeningHours(openingHours: RestaurantOpeningHours[]): void {
    if (openingHours.length !== 7) {
      throw new RestaurantDomainError("Restaurant opening hours must contain exactly 7 days")
    }

    const days = new Set(openingHours.map((hours) => hours.getDayOfWeek()))

    if (days.size !== 7) {
      throw new RestaurantDomainError("Restaurant opening hours cannot contain duplicate days")
    }

    this.openingHours = [...openingHours]
    this.touch()
  }

  public isOpenAt(date: Date): boolean {
    const dayOfWeek = date.getDay()
    const currentTime = Restaurant.formatTime(date)

    const currentDayHours = this.openingHours.find((hours) => hours.getDayOfWeek() === dayOfWeek)

    if (currentDayHours?.containsTime(currentTime)) {
      return true;
    }

    const previousDay = Restaurant.getPreviousDay(dayOfWeek)

    const previousDayHours = this.openingHours.find((hours) => hours.getDayOfWeek() === previousDay)

    if (!previousDayHours || !previousDayHours.isOvernight()) {
      return false
    }

    const closesAt = previousDayHours.getClosesAt()

    if (closesAt === undefined) {
      return false
    }

    const currentMinutes = Restaurant.timeToMinutes(currentTime)
    const closeMinutes = Restaurant.timeToMinutes(closesAt)

    return currentMinutes < closeMinutes
  }

  private static formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")

    return `${hours}:${minutes}`
  }

  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number)

    return hours * 60 + minutes
  }

  private static getPreviousDay(dayOfWeek: number): DayOfWeek {
    if (dayOfWeek === DayOfWeek.SUNDAY) {
      return DayOfWeek.SATURDAY
    }

    return (dayOfWeek - 1) as DayOfWeek
  }

  public getId(): string {
    return this.id;
  }

  public getOwnerId(): string {
    return this.ownerId
  }

  public getName(): RestaurantName {
    return this.name
  }

  public getDescription(): RestaurantDescription {
    return this.description
  }

  public getPhone(): RestaurantPhone {
    return this.phone
  }

  public getEmail(): RestaurantEmail {
    return this.email
  }

  public getStatus(): RestaurantStatus {
    return this.status
  }

  public getCuisines(): readonly RestaurantCuisine[] {
    return [...this.cuisines]
  }

  public getOpeningHours(): readonly RestaurantOpeningHours[] {
    return [...this.openingHours]
  }

  public getCretedAt(): Date {
    return this.createdAt
  }

  public getUpdatedAt(): Date {
    return this.updatedAt
  }

  private touch(): void {
    this.updatedAt = new Date()
  }

}
