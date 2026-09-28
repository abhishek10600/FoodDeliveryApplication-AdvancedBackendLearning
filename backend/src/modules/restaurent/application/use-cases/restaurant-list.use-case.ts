import { RestaurantListFilterInput } from "../dto/resruarant-list.dto.js";
import { RestaurantListResult } from "../dto/restaurant-list-response.dto.js";

export interface RestaurantListUseCase {
  execute(filters: RestaurantListFilterInput): Promise<RestaurantListResult>
}
