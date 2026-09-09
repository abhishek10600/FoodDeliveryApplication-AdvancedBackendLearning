import { InvalidRestaurantNameError } from "../errors/invalid-restaurant-name.error.js";

export class RestaurantName {

  private static readonly RESTAURANT_NAME_MIN: number = 1;
  private static readonly RESTAURANT_NAME_MAX: number = 100;

  private readonly value: string;

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): RestaurantName {
    const normalizedValue = this.normalize(value)

    this.validate(normalizedValue)

    return new RestaurantName(normalizedValue)
  }

  private static normalize(value: string): string {

    const normalizedValue = value.trim().replace(/\s+/g, " ")

    return normalizedValue

  }

  private static validate(value: string): void {
    if (value.length < RestaurantName.RESTAURANT_NAME_MIN) {
      throw new InvalidRestaurantNameError("Restaurant name cannot be empty")
    }

    if (value.length > RestaurantName.RESTAURANT_NAME_MAX) {
      throw new InvalidRestaurantNameError(`Restaurant name cannot be more than ${RestaurantName.RESTAURANT_NAME_MAX}`)
    }
  }

  public getValue(): string {
    return this.value
  }

  public equals(value: string): boolean {
    return this.value === value
  }

  public toString(): string {
    return this.value
  }
}
