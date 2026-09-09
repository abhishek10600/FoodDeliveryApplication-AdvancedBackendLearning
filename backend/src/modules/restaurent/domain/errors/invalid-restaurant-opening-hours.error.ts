import { RestaurantDomainError } from "./restaurant-domain.error.js";

export class InvalidRestaurantOpeningHourError extends RestaurantDomainError {
  constructor(message = "Invalid restaurant opening hour") {
    super(message)

    this.name = "InvalidRestaurantOpeningHourError"
  }
}
