import { DayOfWeek } from "./domain/enums/restaurnat-opening-hours.enum.js"

export type RestaurantOpeningHoursPropsType = {
  dayOfWeek: DayOfWeek;
  opensAt?: string;
  closesAt?: string;
  isClosed: boolean
}
