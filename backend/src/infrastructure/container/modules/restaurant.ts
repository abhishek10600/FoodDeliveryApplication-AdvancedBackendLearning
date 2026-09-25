import { container } from "tsyringe"
import { RestaurantTokens } from "../../../modules/restaurent/infrastructure/persistence/tokens/restaurant.tokens.js"
import { RestaurantRepository } from "../../../modules/restaurent/infrastructure/persistence/prisma/restaurant.repository.js"
import { CuisineRepositopry } from "../../../modules/restaurent/infrastructure/persistence/prisma/cuisine.repository.js"
import { RestaurantOwnerRegisterUseCaseImpl } from "../../../modules/restaurent/application/use-cases/restaurant-owner-register.use-case.impl.js"
import { RestaurantCreationUseCaseImpl } from "../../../modules/restaurent/application/use-cases/restaurant-creation.use-case.impl.js"
import { RestaurantProfileUseCaseImpl } from "../../../modules/restaurent/application/use-cases/restaurant-profile.use-case.impl.js"
import { RestaurantByOwnerUseCaseImpl } from "../../../modules/restaurent/application/use-cases/restaurant-by-owner.use-case.impl.js"
import { RestaurantProfileUpdateUseCaseImpl } from "../../../modules/restaurent/application/use-cases/restaurant-profile-update.use-case.impl.js"
import { RestaurantStatusUpdateUseCaseImpl } from "../../../modules/restaurent/application/use-cases/restaurant-status-update.use-case.impl.js"
import { RestaurantStatusCloseUseCaseImpl } from "../../../modules/restaurent/application/use-cases/restaurant-status-close.use-case.impl.js"
import { RestaurantOpeningHoursUpdateUseCaseImpl } from "../../../modules/restaurent/application/use-cases/restaurant-opening-hours-update.use-case.impl.js"
import { RestaurantTransaction } from "../../../modules/restaurent/infrastructure/persistence/prisma/restaurant.transaction.js"
import { RestaurantCuisineCreationUseCaseImpl } from "../../../modules/restaurent/application/use-cases/restaurant-cuisine-creation.use-case.impl.js"
import { RestaurantCuisineUpdateUseCaseImpl } from "../../../modules/restaurent/application/use-cases/restaurant-cuisine-update.use-case.impl.js"
import { RestaurantCuisineStatusUpdateUseCaseImpl } from "../../../modules/restaurent/application/use-cases/restaurant-cuisine-status-update.use-case.impl.js"
import { RestaurantCuisineDeletionUseCaseImpl } from "../../../modules/restaurent/application/use-cases/restaurant-cuisine-deletion.use-case.impl.js"


export const registerRestaurant = (): void => {

  container.register(RestaurantTokens.RestaurantRepository, {
    useClass: RestaurantRepository
  })

  container.register(RestaurantTokens.CuisineRepository, {
    useClass: CuisineRepositopry
  })

  container.register(RestaurantTokens.Transaction, {
    useClass: RestaurantTransaction
  })

  container.registerSingleton(RestaurantTokens.RestaurantOwnerRegisterUseCase, RestaurantOwnerRegisterUseCaseImpl)

  container.registerSingleton(RestaurantTokens.RestaurantCreationUseCase, RestaurantCreationUseCaseImpl)

  container.registerSingleton(RestaurantTokens.RestaurantProfileUseCase, RestaurantProfileUseCaseImpl)

  container.registerSingleton(RestaurantTokens.RestaurantByOwnerUseCase, RestaurantByOwnerUseCaseImpl)

  container.registerSingleton(RestaurantTokens.RestaurantProfileUpdateUseCase, RestaurantProfileUpdateUseCaseImpl)

  container.registerSingleton(RestaurantTokens.RestaurantStatusUpdateUseCase, RestaurantStatusUpdateUseCaseImpl)

  container.registerSingleton(RestaurantTokens.RestaurantStatusCloseUseCase, RestaurantStatusCloseUseCaseImpl)

  container.registerSingleton(RestaurantTokens.RestaurantOpeningHoursUpdateUseCase, RestaurantOpeningHoursUpdateUseCaseImpl)

  container.registerSingleton(RestaurantTokens.RestaurantCuisineCreationUseCase, RestaurantCuisineCreationUseCaseImpl)

  container.registerSingleton(RestaurantTokens.RestaurantCuisineUpdateUseCase, RestaurantCuisineUpdateUseCaseImpl)

  container.registerSingleton(RestaurantTokens.RestaurantCuisineStatusUpdateUseCase, RestaurantCuisineStatusUpdateUseCaseImpl)

  container.registerSingleton(RestaurantTokens.RestaurantCuisineDeletionUseCase, RestaurantCuisineDeletionUseCaseImpl)

}
