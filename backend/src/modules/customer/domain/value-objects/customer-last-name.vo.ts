import { InvalidCustomerLastName } from "../errors/invalid-customer-last-name.error.js"

export class CustomerLastName {

  private static readonly CUSTOMER_LAST_NAME_MIN: number = 1
  private static readonly CUSTOMER_LAST_NAME_MAX: number = 100

  private readonly value: string

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): CustomerLastName {
    const normalizedValue = CustomerLastName.normalize(value)

    CustomerLastName.validate(normalizedValue)

    return new CustomerLastName(normalizedValue)

  }

  private static normalize(value: string): string {
    if (typeof value !== "string") {
      throw new InvalidCustomerLastName("Customer last name must be a string")
    }

    return value.trim().replace(/\s+/g, " ")
  }

  private static validate(value: string): void {
    if (value.length < this.CUSTOMER_LAST_NAME_MIN) {
      throw new InvalidCustomerLastName("Customer last name cannot be empty")
    }

    if (value.length > this.CUSTOMER_LAST_NAME_MAX) {
      throw new InvalidCustomerLastName(`Customer last name cannot exceed ${this.CUSTOMER_LAST_NAME_MAX}`)
    }
  }

  public getValue(): string {
    return this.value
  }

  public equals(other: CustomerLastName): boolean {
    return this.value === other.value
  }


  public toString(): string {
    return this.value
  }

}
