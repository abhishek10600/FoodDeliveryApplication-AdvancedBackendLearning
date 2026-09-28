export type RestaurantListSort = "name"

export interface RestaurantListFilterInput {
  cuisine?: string;
  city?: string;
  status?: string;
  sortBy?: RestaurantListSort;
  limit?: number;
  cursor?: string;
}
