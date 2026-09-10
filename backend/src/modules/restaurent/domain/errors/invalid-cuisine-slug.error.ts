import { RestaurantDomainError } from "./restaurant-domain.error.js";

export class InvalidCuisineSlugError extends RestaurantDomainError {
  constructor(message = "Invalid cuisine slug") {
    super(message)

    this.name = "InvalidCuisineSlugError"
  }
}
