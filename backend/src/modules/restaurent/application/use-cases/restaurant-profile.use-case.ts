import { RestaurantProfileResult } from "../dto/restaurant-profile-result.dto.js";

export interface RestaurantProfileUseCase {
  execute(restaurantId: string): Promise<RestaurantProfileResult>
}
