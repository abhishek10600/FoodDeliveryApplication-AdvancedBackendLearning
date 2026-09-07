import { InvalidRestaurantEmailError } from "../errors/invalid-restaurant-email.error.js";

export class RestuarantEmail {

  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private readonly value: string;

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): RestuarantEmail {
    const normalizedValue = RestuarantEmail.normalize(value)

    if (!RestuarantEmail.isValid(normalizedValue)) {
      throw new InvalidRestaurantEmailError("Invalid email format")
    }

    return new RestuarantEmail(normalizedValue)
  }

  private static normalize(value: string): string {
    return value.trim().toLowerCase()
  }

  private static isValid(value: string): boolean {
    return RestuarantEmail.EMAIL_REGEX.test(value)
  }

  public getValue(value: string): string {
    return this.value
  }

  public equals(value: string): boolean {
    return value === this.value
  }

  public toString(value: string): string {
    return this.value
  }

}
