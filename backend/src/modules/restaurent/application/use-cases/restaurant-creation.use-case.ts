import { RestaurantCreationResult } from "../dto/restaurant-creation-result.dto.js";
import { RestaurantCreationInput } from "../dto/restaurant-creation.dto.js";

export interface RestaurantCreationUseCase {
  execute(ownerId: string, input: RestaurantCreationInput): Promise<RestaurantCreationResult>
}
