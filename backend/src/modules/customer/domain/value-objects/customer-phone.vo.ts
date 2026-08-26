import { InvalidCustomerPhoneNumberError } from "../errors/invalid-customer-phone-number.error.js"

export class CustomerPhoneNumber {

  private static readonly CUSTOMER_PHONE_MIN: number = 8
  private static readonly CUSTOMER_PHONE_MAX: number = 15

  private readonly value: string

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): CustomerPhoneNumber {
    const normalizedValue = CustomerPhoneNumber.normalize(value)

    CustomerPhoneNumber.validate(normalizedValue)

    return new CustomerPhoneNumber(normalizedValue)
  }

  private static normalize(value: string): string {
    if (typeof value !== "string") {
      throw new InvalidCustomerPhoneNumberError("Customer phone number must be a string")
    }

    const trimmedValue = value.trim()

    if (trimmedValue.length === 0) {
      throw new InvalidCustomerPhoneNumberError("Customer phone number cannot be empty")
    }

    const hasPlusPrefix = trimmedValue.startsWith("+")

    const digits = trimmedValue.replace(/\D/g, " ")

    return hasPlusPrefix ? `+${digits}` : digits
  }

  private static validate(value: string): void {
    if (!/^\+?[0-9]+$/.test(value)) {
      throw new InvalidCustomerPhoneNumberError("Invalid customer phone number format")
    }

    if (value.length < this.CUSTOMER_PHONE_MIN || value.length > this.CUSTOMER_PHONE_MAX) {
      throw new InvalidCustomerPhoneNumberError(`Customer phone number must contain digits between ${this.CUSTOMER_PHONE_MIN} and ${this.CUSTOMER_PHONE_MAX}`)
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: CustomerPhoneNumber): boolean {
    return this.value === other.value
  }

  public toString(): string {
    return this.value
  }

}
