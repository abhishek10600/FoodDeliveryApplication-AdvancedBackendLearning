import { MenuByRestaurantIdInput } from "../../dto/menu/menu-by-restaurant-id.dto.js";
import { MenuResult } from "../../dto/menu/menu-result.dto.js";

export interface MenuByRestaurantIdUseCase {
  execute(input: MenuByRestaurantIdInput): Promise<MenuResult>
}
