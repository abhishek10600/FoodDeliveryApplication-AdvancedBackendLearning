export const RestaurantTokens = {
  RestaurantRepository: Symbol.for("Restaurant.RestaurantRepository"),
  CuisineRepository: Symbol.for("Restaurant.CuisineRepository"),
  RestaurantOwnerRegisterUseCase: Symbol.for("Restaurant.RestaurantOwnerRegisterUseCase"),
  RestaurantCreationUseCase: Symbol.for("Restaurant.RestaurantCreationUseCase"),
  RestaurantProfileUseCase: Symbol.for("Restaurant.RestaurantProfileUseCase"),
  RestaurantByOwnerUseCase: Symbol.for("Restaurant.RestaurantByOwnerUseCase"),
  RestaurantProfileUpdateUseCase: Symbol.for("Restaurant.RestaurantProfileUpdateUseCase"),
  RestaurantStatusUpdateUseCase: Symbol.for("Restaurant.RestaurantStatusUpdateUseCase"),
  RestaurantStatusCloseUseCase: Symbol.for("Restaurant.RestaurantStatusClose"),
  RestaurantOpeningHoursUpdateUseCase: Symbol.for("Restaurant.RestaurantOpeningHoursUpdateUseCase"),
  RestaurantCuisineCreationUseCase: Symbol.for("Restaurant.RestaurantCuisineCreationUseCase"),
  RestaurantCuisineUpdateUseCase: Symbol.for("Restaurant.RestaurantCuisineUpdateUseCase"),
  RestaurantCuisineStatusUpdateUseCase: Symbol.for("Restaurant.RestaurantCuisineStatusUpdateUseCase"),
  RestaurantCuisineDeletionUseCase: Symbol.for("Restaurant.RestaurantCuisineDeletionUseCase"),

  Transaction: Symbol.for("Restaurant.Transaction"),
} as const
