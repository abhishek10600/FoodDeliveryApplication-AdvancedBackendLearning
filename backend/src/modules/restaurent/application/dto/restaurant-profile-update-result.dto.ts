import { RestaurantStatus } from "../../domain/enums/restaurant-status.enum.js";
import { DayOfWeek } from "../../domain/enums/restaurnat-opening-hours.enum.js";
import { RestaurantAddressResult } from "./restaurant-address.dto.js";

export interface RestaurantProfileUpdateResult {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  address: RestaurantAddressResult;
  status: RestaurantStatus;
  openingHours: Array<{
    dayOfWeek: DayOfWeek,
    opensAt: string | null,
    closesAt: string | null,
    isClosed: boolean
  }>,
  createdAt: Date;
  updatedAt: Date;
}
