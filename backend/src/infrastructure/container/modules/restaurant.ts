import { container } from "tsyringe"
import { RestaurantTokens } from "../../../modules/restaurent/infrastructure/persistence/tokens/restaurant.tokens.js"
import { RestaurantRepository } from "../../../modules/restaurent/infrastructure/persistence/prisma/restaurant.repository.js"
import { CuisineRepositopry } from "../../../modules/restaurent/infrastructure/persistence/prisma/cuisine.repository.js"
import { RestaurantCreationUseCaseImpl } from "../../../modules/restaurent/application/use-cases/restaurant-createion.use-case.impl.js"

export const registerRestaurant = (): void => {

  container.register(RestaurantTokens.RestaurantRepository, {
    useClass: RestaurantRepository
  })

  container.register(RestaurantTokens.CuisineRepository, {
    useClass: CuisineRepositopry
  })

  container.registerSingleton(RestaurantTokens.RestaurantCreationUseCase, RestaurantCreationUseCaseImpl)

}
