export const RestaurantTokens = {
  RestaurantRepository: Symbol.for("Restaurant.RestaurantRepository"),
  CuisineRepository: Symbol.for("Restaurant.CuisineRepository"),
  RestaurantCreationUseCase: Symbol.for("Restaurant.RestaurantCreationUseCase")
} as const
