import { CustomerDomainError } from "./customer-domain.error.js";

export class CustomerNotFoundError extends CustomerDomainError {
  constructor(message = "Customer not found") {
    super(message)

    this.name = "CustomerNotFoundError"
  }
}
