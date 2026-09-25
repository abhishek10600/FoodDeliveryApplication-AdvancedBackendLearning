import { RestaurantCuisineUpdateInput } from "../dto/restaurant-cuisine-update.dto.js";

export interface RestaurantCuisineUpdateUseCase {
  execute(input: RestaurantCuisineUpdateInput): Promise<void>
}
