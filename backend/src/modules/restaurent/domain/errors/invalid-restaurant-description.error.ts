import { RestaurantDomainError } from "./restaurant-domain.error.js";

export class InvalidRestaurantDescriptionError extends RestaurantDomainError {
  constructor(message = "Invalid restaurant description") {
    super(message)

    this.name = "InvalidRestaurantDescriptionError"
  }
}
