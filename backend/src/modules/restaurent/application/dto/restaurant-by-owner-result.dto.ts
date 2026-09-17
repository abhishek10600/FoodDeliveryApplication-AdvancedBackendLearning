import { RestaurantStatus } from "../../domain/enums/restaurant-status.enum.js";
import { RestaurantAddressResult } from "./restaurant-address.dto.js";

export interface RestaurantByOwnerResult {
  Restaurant: {
    id: string;
    name: string;
    description: string;
    status: RestaurantStatus;
    phone: string;
    email: string;
    address: RestaurantAddressResult
  }
}
