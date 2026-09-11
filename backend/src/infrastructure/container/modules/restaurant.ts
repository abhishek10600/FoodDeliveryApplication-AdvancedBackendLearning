import { container } from "tsyringe"
import { RestaurantTokens } from "../../../modules/restaurent/infrastructure/persistence/tokens/restaurant.tokens.js"
import { RestaurantRepository } from "../../../modules/restaurent/infrastructure/persistence/prisma/restaurant.repository.js"

export const registerRestaurant = (): void => {

  container.register(RestaurantTokens.RestaurantRepository, {
    useClass: RestaurantRepository
  })

}
