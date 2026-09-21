import { RestaurantStatusUpdateInput } from "../dto/restaurant-status-update.dto.js";

export interface RestaurantStatusUpdateUseCase {
  execute(input: RestaurantStatusUpdateInput): Promise<void>
}
