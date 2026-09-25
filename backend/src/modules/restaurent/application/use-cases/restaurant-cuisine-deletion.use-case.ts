import { RestaurantCuisineDeletionInput } from "../dto/restaurant-cuisine-deletion.dto.js";

export interface RestaurantCuisineDeletionUseCase {
  execute(input: RestaurantCuisineDeletionInput): Promise<void>
}
