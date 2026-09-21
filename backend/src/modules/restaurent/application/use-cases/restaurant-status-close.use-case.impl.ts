import { injectable, inject} from "tsyringe"
import { RestaurantStatusUpdateInput } from "../dto/restaurant-status-update.dto.js";
import { RestaurantStatusCloseUseCase } from "./restaurant-status-close.use-case.js";
import { RestaurantTokens } from "../../infrastructure/persistence/tokens/restaurant.tokens.js";
import type { IRestaurantRepository } from "../../domain/repositories/restaurant.repository.js";
import { RestaurantDomainError } from "../../domain/errors/restaurant-domain.error.js";
import { RestaurantStatus } from "../../../../../generated/prisma/index.js";


@injectable()
export class RestaurantStatusCloseUseCaseImpl implements RestaurantStatusCloseUseCase {
  constructor(

    @inject(RestaurantTokens.RestaurantRepository)
    private readonly restaurantRepo: IRestaurantRepository

  ) { }

  async execute(input: RestaurantStatusUpdateInput): Promise<void> {
    const restaurant = await this.restaurantRepo.findById(input.restaurantId)

    if (!restaurant) {
      throw new RestaurantDomainError("Restaurant not found")
    }

    if (restaurant.getOwnerId() !== input.ownerId) {
      throw new RestaurantDomainError("You are not authorized to perform this action")
    }

    if (restaurant.getStatus() === RestaurantStatus.ACTIVE || restaurant.getStatus() === RestaurantStatus.INACTIVE) {
      restaurant.close()

      await this.restaurantRepo.update(restaurant)
    }
  }
}
