import { InvalidCustomerFirstNameError } from "../errors/invalid-customer-first-name.error.js";

export class CustomerFirstName {
  private static readonly CUSTOMER_FIRST_NAME_MIN: number = 1
  private static readonly CUSTOMER_FIRST_NAME_MAX: number = 100

  private readonly value: string;

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): CustomerFirstName {
    const validatedValue = CustomerFirstName.normalize(value)

    CustomerFirstName.validate(validatedValue)

    return new CustomerFirstName(validatedValue)
  }

  private static normalize(value: string): string {
    if (typeof value !== "string") {
      throw new InvalidCustomerFirstNameError("Customer first name must be a string")
    }

    return value.trim().replace(/\s+/g, " ")
  }

  private static validate(value: string): void {
    if (value.length < this.CUSTOMER_FIRST_NAME_MIN) {
      throw new InvalidCustomerFirstNameError("Customer fisrt name cannot be empty")
    }

    if (value.length > this.CUSTOMER_FIRST_NAME_MAX) {
      throw new InvalidCustomerFirstNameError(`Customer last name cannot exceed ${this.CUSTOMER_FIRST_NAME_MAX}`)
    }
  }

  public getValue(): string {
    return this.value
  }

  public equals(other: CustomerFirstName): boolean {
    return this.value === other.value
  }

  public toString(): string {
    return this.value
  }
}
