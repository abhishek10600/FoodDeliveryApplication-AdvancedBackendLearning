import { RestaurantAddressInput } from "./restaurant-address-creation.dto.js";
import { RestaurantOpeningHoursInput } from "./restaurant-opening-hours.dto.js";

export interface RestaurantCreationInput {
  name: string;
  description: string;
  phone: string;
  email: string;
  address: RestaurantAddressInput,
  cuisineIds: string[],
  openingHours: RestaurantOpeningHoursInput[]
}
