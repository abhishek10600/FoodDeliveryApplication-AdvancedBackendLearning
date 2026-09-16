import { container } from "tsyringe"
import { RestaurantTokens } from "../../../modules/restaurent/infrastructure/persistence/tokens/restaurant.tokens.js"
import { RestaurantRepository } from "../../../modules/restaurent/infrastructure/persistence/prisma/restaurant.repository.js"
import { CuisineRepositopry } from "../../../modules/restaurent/infrastructure/persistence/prisma/cuisine.repository.js"
import { RestaurantOwnerRegisterUseCaseImpl } from "../../../modules/restaurent/application/use-cases/restaurant-owner-register.use-case.impl.js"
import { RestaurantCreationUseCaseImpl } from "../../../modules/restaurent/application/use-cases/restaurant-creation.use-case.impl.js"
import { RestaurantProfileUseCaseImpl } from "../../../modules/restaurent/application/use-cases/restaurant-profile.use-case.impl.js"


export const registerRestaurant = (): void => {

  container.register(RestaurantTokens.RestaurantRepository, {
    useClass: RestaurantRepository
  })

  container.register(RestaurantTokens.CuisineRepository, {
    useClass: CuisineRepositopry
  })

  container.registerSingleton(RestaurantTokens.RestaurantOwnerRegisterUseCase, RestaurantOwnerRegisterUseCaseImpl)

  container.registerSingleton(RestaurantTokens.RestaurantCreationUseCase, RestaurantCreationUseCaseImpl)

  container.registerSingleton(RestaurantTokens.RestaurantProfileUseCase, RestaurantProfileUseCaseImpl)

}
