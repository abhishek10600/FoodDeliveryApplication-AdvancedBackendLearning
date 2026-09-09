import { RestaurantDomainError } from "./restaurant-domain.error.js";

export class InvalidRestaurantCuisineError extends RestaurantDomainError {
  constructor(message = "Invalid restaurant cuisine error") {
    super(message)

    this.name = "InvalidRestaurantCuisineError"
  }
}
