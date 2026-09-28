import { RestaurantListFilterInput } from "../../application/dto/resruarant-list.dto.js";
import { RestaurantListResult } from "../../application/dto/restaurant-list-response.dto.js";
import { Restaurant, RestaurantCuisine } from "../entities/index.js";

export interface IRestaurantRepository {
  create(restaurant: Restaurant): Promise<Restaurant>
  get(filters: RestaurantListFilterInput): Promise<RestaurantListResult>
  findById(id: string): Promise<Restaurant | null>
  findByOwnerId(ownerId: string): Promise<Restaurant[]>
  update(restaurant: Restaurant): Promise<void>
  createRestaurantCuisine(restaurantCuisine: RestaurantCuisine): Promise<RestaurantCuisine>
}
