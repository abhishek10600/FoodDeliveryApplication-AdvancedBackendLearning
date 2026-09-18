import { RestaurantAddressInput } from "./restaurant-address-creation.dto.js";

export interface RestaurantProfileUpdateInput {
  name?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: RestaurantAddressInput
}
