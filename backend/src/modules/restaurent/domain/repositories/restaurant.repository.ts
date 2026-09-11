import { Restaurant } from "../entities/index.js";

export interface IRestaurantRepository {
  create(restaurant: Restaurant): Promise<Restaurant>
  findById(id: string): Promise<Restaurant | null>
  findByOwnerId(ownerId: string): Promise<Restaurant[]>
  update(restaurant: Restaurant): Promise<void>
}
