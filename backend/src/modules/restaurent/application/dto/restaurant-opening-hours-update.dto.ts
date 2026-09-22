export interface RestaurantOpeningHoursInput {
  restaurantId: string;
  ownerId: string;
  dayOfWeek: number;
  opensAt: string;
  closesAt: string;
  isClosed: boolean;
}
