import { RestaurantStatus } from "../../../../../generated/prisma/index.js";
import { DayOfWeek } from "../../domain/enums/restaurnat-opening-hours.enum.js";
import { RestaurantAddressResult } from "./restaurant-address.dto.js";

export interface RestaurantProfileResult {
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
