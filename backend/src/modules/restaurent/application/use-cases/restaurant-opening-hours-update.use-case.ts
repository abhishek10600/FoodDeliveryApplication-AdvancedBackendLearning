import { RestaurantOpeningHoursInput } from "../dto/restaurant-opening-hours-update.dto.js";

export interface RestaurantOpeningHoursUpdateUseCase {
  execute(input: RestaurantOpeningHoursInput): Promise<void>
}
