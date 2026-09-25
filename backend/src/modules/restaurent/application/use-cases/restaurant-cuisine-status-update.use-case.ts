import { RestaurantCuisineStatusUpdateInput } from "../dto/restaurant-cuisine-status-update.dto.js";

export interface RestaurantCuisineStatusUpdateUseCase {
  execute(input: RestaurantCuisineStatusUpdateInput): Promise<void>
}
