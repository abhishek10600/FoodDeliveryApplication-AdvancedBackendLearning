import { RestaurantDomainError } from "./restaurant-domain.error.js";

export class InvalidRestaurantDescriptionError extends RestaurantDomainError {
  constructor(message = "Invalid restaurant description") {
    super(message, 400)

    this.name = "InvalidRestaurantDescriptionError"
  }
}
