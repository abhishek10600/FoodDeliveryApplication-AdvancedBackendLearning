import { RestaurantDomainError } from "./restaurant-domain.error.js";

export class InvalidRestaurantNameError extends RestaurantDomainError {
  constructor(message = "Invalid restaurant name") {
    super(message)

    this.name = "InvalidRestaurantNameError"
  }
}
