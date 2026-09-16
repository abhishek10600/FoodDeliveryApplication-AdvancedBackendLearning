import { RestaurantStatus } from "../../domain/enums/restaurant-status.enum.js";
import { DayOfWeek } from "../../domain/enums/restaurnat-opening-hours.enum.js";

export interface RestaurantCreationResult {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  phone: string;
  email: string;
  address: {
    line1: string;
    landMark: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  },
  status: RestaurantStatus,
  openingHours: Array<{
    dayOfWeek: DayOfWeek,
    opensAt: string | null,
    closesAt: string | null,
    isClosed: boolean
  }>
  cuisineIds: string[],
  createdAt: Date,
  updatedAt: Date
}
