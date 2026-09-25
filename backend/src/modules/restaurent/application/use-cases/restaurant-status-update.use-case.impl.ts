import { injectable, inject } from "tsyringe";
import { RestaurantStatusUpdateUseCase } from "./restaurant-status-update.use-case.js";
import { RestaurantTokens } from "../../infrastructure/persistence/tokens/restaurant.tokens.js";
import type { IRestaurantRepository } from "../../domain/repositories/restaurant.repository.js";
import { RestaurantStatusUpdateInput } from "../dto/restaurant-status-update.dto.js";
import { RestaurantDomainError } from "../../domain/errors/restaurant-domain.error.js";
import { RestaurantStatus } from "../../domain/enums/restaurant-status.enum.js";

@injectable()
export class RestaurantStatusUpdateUseCaseImpl implements RestaurantStatusUpdateUseCase {
  constructor(

    @inject(RestaurantTokens.RestaurantRepository)
    private readonly restaurantRepo: IRestaurantRepository

  ) { }

  async execute(input: RestaurantStatusUpdateInput): Promise<void> {
    const restaurant = await this.restaurantRepo.findById(input.restaurantId)

    if (!restaurant) {
      throw new RestaurantDomainError("Restaurant not found", 404)
    }

    if (input.ownerId !== restaurant.getOwnerId()) {
      throw new RestaurantDomainError("You do not have the permission to perform this action", 403)
    }

    if (restaurant.getStatus() === RestaurantStatus.CLOSED) {
      restaurant.reopen()

      await this.restaurantRepo.update(restaurant)

      return
    }


    if (restaurant.getStatus() === RestaurantStatus.PENDING || restaurant.getStatus() === RestaurantStatus.INACTIVE) {
      console.log({ restaurantStatusType: typeof(restaurant.getStatus()) })
      console.log({ restaurantStatus: restaurant.getStatus() })
      restaurant.activate()

      console.log({restaurantStatusAfterActivate: restaurant.getStatus()})

      await this.restaurantRepo.update(restaurant)

      return;
    }

    if (restaurant.getStatus() === "ACTIVE") {

      restaurant.deactivate()

      console.log({restaurantStatusAfterDeactivate: restaurant.getStatus()})

      await this.restaurantRepo.update(restaurant)

      return;
    }

  }
}
