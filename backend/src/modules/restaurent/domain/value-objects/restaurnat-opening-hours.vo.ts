import { RestaurantOpeningHoursPropsType } from "../../types.js"
import { DayOfWeek } from "../enums/restaurnat-opening-hours.enum.js"
import { InvalidRestaurantOpeningHourError } from "../errors/invalid-restaurant-opening-hours.error.js"

export class RestaurantOpeningHours {

  private readonly dayOfWeek: DayOfWeek
  private readonly opensAt?: string
  private readonly closesAt?: string
  private readonly isClosed: boolean

  constructor(input: RestaurantOpeningHoursPropsType) {
    this.dayOfWeek = input.dayOfWeek
    this.opensAt = input.opensAt
    this.closesAt = input.closesAt
    this.isClosed = input.isClosed
  }

  public static create(input: RestaurantOpeningHoursPropsType): RestaurantOpeningHours {
    if (input.isClosed) {

      if (input.opensAt !== undefined || input.closesAt !== undefined) {
        throw new InvalidRestaurantOpeningHourError("Closed restaurant day cannot have opening or closing time")
      }

      return new RestaurantOpeningHours({
        dayOfWeek: input.dayOfWeek,
        isClosed: input.isClosed
      })
    }

    if (input.opensAt === undefined || input.closesAt === undefined) {
      throw new InvalidRestaurantOpeningHourError("Opening and closing time are required when restaurant is open")
    }

    const opensAt = RestaurantOpeningHours.normalizeTime(input.opensAt)
    const closesAt = RestaurantOpeningHours.normalizeTime(input.closesAt)

    RestaurantOpeningHours.validateTimeRange(opensAt, closesAt)

    return new RestaurantOpeningHours({
      dayOfWeek: input.dayOfWeek,
      opensAt,
      closesAt,
      isClosed: input.isClosed
    })
  }

  private static validateTime(value: string): void {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!timeRegex.test(value)) {
      throw new InvalidRestaurantOpeningHourError(`Invalid opening hour time format: ${value}. Expected HH:mm`)
    }
  }

  private static normalizeTime(value: string): string {
    const normalizedValue = value.trim()

    RestaurantOpeningHours.validateTime(normalizedValue)

    return normalizedValue;
  }

  private static validateTimeRange(opensAt: string, closesAt: string): void {
    const openMinutes = RestaurantOpeningHours.timeToMinutes(opensAt)
    const closeMinutes = RestaurantOpeningHours.timeToMinutes(closesAt)

    if (openMinutes === closeMinutes) {
      throw new InvalidRestaurantOpeningHourError("Opening and closing time cannot be same")
    }
  }

  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);

    return hours * 60 + minutes
  }

  public getDayOfWeek(): DayOfWeek {
    return this.dayOfWeek
  }

  public getOpensAt(): string | undefined{
    return this.opensAt
  }

  public getClosesAt(): string | undefined {
    return this.closesAt
  }

  public getIsClosed(): boolean {
    return this.isClosed
  }

  public isOvernight(): boolean {
    if (this.isClosed || !this.opensAt || !this.closesAt) {
      return false
    }

    const openMinutes = RestaurantOpeningHours.timeToMinutes(this.opensAt)
    const closeMinutes = RestaurantOpeningHours.timeToMinutes(this.closesAt)

    return closeMinutes < openMinutes
  }

  public containsTime(time: string): boolean {
    if (this.isClosed || !this.opensAt || !this.closesAt) {
      return false
    }

    const normalizedTime = RestaurantOpeningHours.normalizeTime(time)
    const currentMinutes = RestaurantOpeningHours.timeToMinutes(normalizedTime)
    const openMinutes = RestaurantOpeningHours.timeToMinutes(this.opensAt)
    const closeMinutes = RestaurantOpeningHours.timeToMinutes(this.closesAt)

    if (openMinutes < closeMinutes) {
      return (currentMinutes >= openMinutes && currentMinutes < closeMinutes)
    }

    return (currentMinutes >= openMinutes || currentMinutes < closeMinutes)
  }

  public equals(other: RestaurantOpeningHours): boolean {
    return (
      this.dayOfWeek === other.dayOfWeek &&
      this.opensAt === other.opensAt &&
      this.closesAt === other.closesAt &&
      this.isClosed === other.isClosed
    )
  }

}
