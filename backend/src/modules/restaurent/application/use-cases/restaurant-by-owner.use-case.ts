// import { RestaurantByOwnerResult } from "../dto/restaurant-by-owner-result.dto.js";
import { RestaurantByOwnerResult } from "../dto/restaurant-by-owner-result.dto.js";
import { RestaurantByOwnerInput } from "../dto/restaurant-by-owner.dto.js";

export interface RestaurantByOwnerUseCase {
  execute(input: RestaurantByOwnerInput): Promise<RestaurantByOwnerResult[]>
}
