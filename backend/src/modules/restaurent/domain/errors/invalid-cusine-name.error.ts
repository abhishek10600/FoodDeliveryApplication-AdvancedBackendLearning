import { RestaurantDomainError } from "./restaurant-domain.error.js";

export class InvalidCuisineNameError extends RestaurantDomainError {
  constructor(message = "Invalid cuisine name") {
    super(message, 400)

    this.name = "InvalidCuisineNameError"
  }
}
