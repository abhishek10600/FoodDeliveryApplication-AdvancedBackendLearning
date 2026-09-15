import { RegisterRestaurantOwnerResult } from "../dto/restaurant-owner-register-result.dto.js";
import { RestaurantOwnerRegisterInput } from "../dto/restaurant-owner-register.dto.js";

export interface RestaurantOwnerRegisterUseCase {

  execute(input: RestaurantOwnerRegisterInput): Promise<RegisterRestaurantOwnerResult>

}
