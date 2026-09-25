import { RestaurantDomainError } from "./restaurant-domain.error.js";

export class InvalidRestaurantPhoneError extends RestaurantDomainError {
  constructor(message = "Invalid restaurant phone number") {
    super(message, 400)

    this.name = "InvalidRestaurantPhoneError"
  }
}
