import { RestaurantDomainError } from "./restaurant-domain.error.js";

export class InvalidRestaurantNameError extends RestaurantDomainError {
  constructor(message = "Invalid customer name") {
    super(message)

    this.name = "InvalidRestaurantNameError"
  }
}
