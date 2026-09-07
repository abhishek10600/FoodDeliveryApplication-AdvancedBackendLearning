import { RestaurantDomainError } from "./restaurant-domain.error.js";

export class InvalidRestaurantEmailError extends RestaurantDomainError {
  constructor(message = "Invalid restaurant email") {
    super(message)

    this.name = "InvalidRestaurantEmailError"
  }
}
