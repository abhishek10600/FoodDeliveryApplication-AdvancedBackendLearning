export const RestaurantTokens = {
  RestaurantRepository: Symbol.for("Restaurant.RestaurantRepository"),
  CuisineRepository: Symbol.for("Restaurant.CuisineRepository"),
  RestaurantOwnerRegisterUseCase: Symbol.for("Restaurant.RestaurantOwnerRegisterUseCase"),
  RestaurantCreationUseCase: Symbol.for("Restaurant.RestaurantCreationUseCase"),
  RestaurantProfileUseCase: Symbol.for("Restaurant.RestaurantProfileUseCase"),
  RestaurantByOwnerUseCase: Symbol.for("Restaurant.RestaurantByOwnerUseCase"),
  RestaurantProfileUpdateUseCase: Symbol.for("Restaurant.RestaurantProfileUpdateUseCase")
} as const
