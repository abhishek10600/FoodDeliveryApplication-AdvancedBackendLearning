import { CustomerDomainError } from "./customer-domain.error.js";

export class InvalidCustomerPreferencesError extends CustomerDomainError {
  constructor(message = "Invalid customer preferences") {
    super(message)

    this.name = "InvalidCustomerPreferencesError"
  }
}
