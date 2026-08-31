import { InvalidCustomerAvatarUrlError } from "../errors/invalid-customer-avatar-url.error.js"

export class CustomerAvatarUrl {

  private readonly value: string | null

  constructor(value: string | null) {
    this.value = value
  }

  public static create(value: string | null): CustomerAvatarUrl {

    if (value) {
      const normalizedValue = CustomerAvatarUrl.normalize(value)

      CustomerAvatarUrl.validate(normalizedValue)
    }

    return new CustomerAvatarUrl(value)
  }

  private static normalize(value: string): string {
    const trimmedValue = value.trim()

    if (trimmedValue.length === 0) {
      throw new InvalidCustomerAvatarUrlError("Customer avatar url cannot be empty")
    }

    return trimmedValue
  }

  private static validate(value: string): void {
    let url: URL

    try {
      url = new URL(value)
    } catch{
      throw new InvalidCustomerAvatarUrlError("Customer avatar url must be a valid url")
    }

    if (url.protocol !== "https:") {
      throw new InvalidCustomerAvatarUrlError("Customer avatar url must use HTTPs")
    }
  }

  public getValue(): string | null {
    return this.value
  }

  public equals(other: CustomerAvatarUrl): boolean {
    return this.value === other.value
  }

  public toString(): string | null{
    return this.value
  }
}
