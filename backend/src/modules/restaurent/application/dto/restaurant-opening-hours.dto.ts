import { DayOfWeek } from "../../domain/enums/restaurnat-opening-hours.enum.js";

export interface RestaurantOpeningHoursInput {
  DayOfWeek: DayOfWeek,
  opensAt: string | null | undefined,
  closesAt: string | null | undefined,
  isClosed: boolean
}
