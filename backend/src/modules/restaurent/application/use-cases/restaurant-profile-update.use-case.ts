import { RestaurantProfileUpdateInput } from "../dto/restaurant-profile-update.dto.js";

export interface RestaurantProfileUpdateUseCase {
  execute(restaurantId: string, ownerId: string, input: RestaurantProfileUpdateInput): Promise<void>
}
