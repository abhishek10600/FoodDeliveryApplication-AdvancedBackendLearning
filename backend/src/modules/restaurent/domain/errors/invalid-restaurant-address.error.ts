import { RestaurantDomainError } from "./restaurant-domain.error.js";

export class InvalidRestaurantAddressError extends RestaurantDomainError {
  constructor(message = "Invalid restaurant address") {
    super(message)

    this.name = "InvalidRestaurantAddressError"
  }
}
