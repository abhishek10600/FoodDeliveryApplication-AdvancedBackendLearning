import { InvalidRestaurantDescriptionError } from "../errors/invalid-restaurant-description.error.js";

export class RestaurantDescription {

  private static readonly RESTAURANT_DESCRIPTION_MIN: number = 1
  private static readonly RESTAURANT_DESCRIPTION_MAX: number = 500

  private readonly value: string;

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): RestaurantDescription {
    const normalizedValue = RestaurantDescription.normalize(value)

    RestaurantDescription.validate(normalizedValue)

    return new RestaurantDescription(value)
  }

  private static normalize(value: string): string {
    const normalizedValue = value.trim().replace(/\s+/g, " ")

    return normalizedValue
  }

  private static validate(value: string): void {
    if (value.length < RestaurantDescription.RESTAURANT_DESCRIPTION_MIN) {
      throw new InvalidRestaurantDescriptionError("Resturant description cannot be empty")
    }

    if (value.length > RestaurantDescription.RESTAURANT_DESCRIPTION_MAX) {
      throw new InvalidRestaurantDescriptionError(`Restaurant description cannot contain more than ${RestaurantDescription.RESTAURANT_DESCRIPTION_MAX}`)
    }
  }

  public getValue(): string {
    return this.value
  }

  public equals(value: string): boolean {
    return value === this.value
  }

  public toString(value: string): string {
    return this.value
  }

}
