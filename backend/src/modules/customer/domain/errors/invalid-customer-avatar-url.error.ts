import { CustomerDomainError } from "./customer-domain.error.js";

export class InvalidCustomerAvatarUrlError extends CustomerDomainError {
  constructor(message = "Invalid customer avatar url") {
    super(message)

    this.name = "InvalidCustomerAvatarUrlError"
  }
}
