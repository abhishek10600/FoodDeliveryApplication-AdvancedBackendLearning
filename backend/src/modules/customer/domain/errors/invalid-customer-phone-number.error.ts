import { CustomerDomainError } from "./customer-domain.error.js";

export class InvalidCustomerPhoneNumberError extends CustomerDomainError {
  constructor(message = "Invalid customer phone number") {
    super(message)

    this.name = "InvalidCustomerPhoneNumberError"
  }
}
