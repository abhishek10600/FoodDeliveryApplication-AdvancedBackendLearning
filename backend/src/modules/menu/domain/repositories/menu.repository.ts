import { Menu } from "../entities/menu.entity.js";

export interface IMenuRepository {
  findById(id: string): Promise<Menu | null>
  findByRestaurantId(restaurantId: string): Promise<Menu | null>
  existsForRestaurant(restaurantId: string): Promise<Boolean>
  create(menu: Menu): Promise<Menu>
  update(id: string, menu: Menu): Promise<void>
  delete(id: string): Promise<void>
}
