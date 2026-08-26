import { CustomerDomainError } from "./customer-domain.error.js";

export class InvalidCustomerLastName extends CustomerDomainError {
  constructor(message = "Invalid customer last name") {
    super(message)

    this.name = "InvalidCustomerLastName"
  }
}
