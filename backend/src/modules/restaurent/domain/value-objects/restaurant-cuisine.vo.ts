import { InvalidRestaurantCuisineError } from "../errors/invalud-restaurant-cusine.error.js"

export class RestaurantCuisine {

  private static readonly CUISINE_NAME_MIN: number = 1
  private static readonly CUISINE_NAME_MAX: number =  100

  private readonly value: string

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): RestaurantCuisine  {
    const normalizedValue = RestaurantCuisine.normalize(value)

    RestaurantCuisine.validate(normalizedValue)

    return new RestaurantCuisine(normalizedValue)

  }

  private static normalize(value: string): string {

    if (typeof value !== "string") {
      throw new InvalidRestaurantCuisineError("Cuisine name must be a string")
    }

    const normalizedValue = value.trim().toLowerCase()

    return normalizedValue

  }

  private static validate(value: string): void {

    if (value.length < RestaurantCuisine.CUISINE_NAME_MIN) {
      throw new InvalidRestaurantCuisineError("Cuisine name cannot be empty")
    }

    if (value.length > RestaurantCuisine.CUISINE_NAME_MAX) {
      throw new InvalidRestaurantCuisineError(`Cuisine name cannot be more than ${RestaurantCuisine.CUISINE_NAME_MAX} characters`)
    }

  }

  public getValue(): string {
    return this.value
  }

  public equals(other: RestaurantCuisine): boolean {
    return other.value === this.value
  }

  public toString(): string {
    return this.value
  }

}
