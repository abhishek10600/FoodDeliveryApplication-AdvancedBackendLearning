import { Restaurant } from "../../domain/entities/restaurant.entity.js";

export interface RestaurantListResult {
  items: Restaurant[];
  nextCursor: string | null;
  hasNextPage: boolean;
}
