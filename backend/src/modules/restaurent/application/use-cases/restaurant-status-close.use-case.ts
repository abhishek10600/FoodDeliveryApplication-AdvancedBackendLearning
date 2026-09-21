import { RestaurantStatusUpdateInput } from "../dto/restaurant-status-update.dto.js";

export interface RestaurantStatusCloseUseCase {
  execute(input: RestaurantStatusUpdateInput): Promise<void>
}
