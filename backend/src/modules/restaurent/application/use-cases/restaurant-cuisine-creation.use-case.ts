import { RestaurantCuisineCreationInput } from "../dto/restaurant-cuisine-creation.dto.js";

export interface RestaurantCuisineCreationUseCase {
  execute(input: RestaurantCuisineCreationInput): Promise<void>
}
