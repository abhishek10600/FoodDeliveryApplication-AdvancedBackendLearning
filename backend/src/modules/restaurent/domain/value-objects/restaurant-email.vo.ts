import { InvalidRestaurantEmailError } from "../errors/invalid-restaurant-email.error.js";

export class RestaurantEmail {

  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private readonly value: string;

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): RestaurantEmail {
    const normalizedValue = RestaurantEmail.normalize(value)

    if (!RestaurantEmail.isValid(normalizedValue)) {
      throw new InvalidRestaurantEmailError("Invalid email format")
    }

    return new RestaurantEmail(normalizedValue)
  }

  private static normalize(value: string): string {
    return value.trim().toLowerCase()
  }

  private static isValid(value: string): boolean {
    return RestaurantEmail.EMAIL_REGEX.test(value)
  }

  public getValue(): string {
    return this.value
  }

  public equals(value: string): boolean {
    return value === this.value
  }

  public toString(): string {
    return this.value
  }

}
