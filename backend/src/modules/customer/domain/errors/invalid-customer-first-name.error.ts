import { CustomerDomainError } from "./customer-domain.error.js";

export class InvalidCustomerFirstNameError extends CustomerDomainError {
  constructor(message = "Invalid customer first name") {
    super(message)

    this.name = "InvalidCustomerFirstNameError"
  }
}
