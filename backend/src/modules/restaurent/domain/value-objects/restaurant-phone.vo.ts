import { InvalidRestaurantPhoneError } from "../errors/invalid-restaurant-phone.error.js";

export class RestaurantPhone {

  private static readonly CUSTOMER_PHONE_MIN: number = 8
  private static readonly CUSTOMER_PHONE_MAX: number = 15


  private readonly value: string;

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): RestaurantPhone {
    const normalizedValue = RestaurantPhone.normalize(value)

    RestaurantPhone.validate(normalizedValue)

    return new RestaurantPhone(normalizedValue)
  }


  private static normalize(value: string): string {
    if (typeof value !== "string") {
      throw new InvalidRestaurantPhoneError("Customer phone number must be a string")
    }

    const trimmedValue = value.trim()

    if (trimmedValue.length === 0) {
      throw new InvalidRestaurantPhoneError("Customer phone number cannot be empty")
    }

    const hasPlusPrefix = trimmedValue.startsWith("+")

    const digits = trimmedValue.replace(/\D/g, "")

    return hasPlusPrefix ? `+${digits}` : digits
  }

  private static validate(value: string): void {
    if (!/^\+?[0-9]+$/.test(value)) {
      throw new InvalidRestaurantPhoneError("Invalid customer phone number format")
    }

    if (value.length < this.CUSTOMER_PHONE_MIN || value.length > this.CUSTOMER_PHONE_MAX) {
      throw new InvalidRestaurantPhoneError(`Customer phone number must contain digits between ${this.CUSTOMER_PHONE_MIN} and ${this.CUSTOMER_PHONE_MAX}`)
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(value: string): boolean {
    return value === this.value
  }

  public toString(): string {
    return this.value
  }

}
