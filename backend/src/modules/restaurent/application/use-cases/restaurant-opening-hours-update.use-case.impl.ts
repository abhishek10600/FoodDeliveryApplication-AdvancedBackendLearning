import { injectable, inject } from "tsyringe";
import { RestaurantOpeningHoursInput } from "../dto/restaurant-opening-hours-update.dto.js";
import { RestaurantOpeningHoursUpdateUseCase } from "./restaurant-opening-hours-update.use-case.js";
import { RestaurantTokens } from "../../infrastructure/persistence/tokens/restaurant.tokens.js";
import type { IRestaurantRepository } from "../../domain/repositories/restaurant.repository.js";
import { RestaurantDomainError } from "../../domain/errors/restaurant-domain.error.js";
import { RestaurantOpeningHours } from "../../domain/value-objects/restaurnat-opening-hours.vo.js";

@injectable()
export class RestaurantOpeningHoursUpdateUseCaseImpl implements RestaurantOpeningHoursUpdateUseCase {
  constructor(

    @inject(RestaurantTokens.RestaurantRepository)
    private readonly restaurantRepo: IRestaurantRepository

  ) { }

  async execute(input: RestaurantOpeningHoursInput): Promise<void> {
    const restaurant = await this.restaurantRepo.findById(input.restaurantId)

    if (!restaurant) {
      throw new RestaurantDomainError("Restaurant not found")
    }

    if (input.ownerId !== restaurant.getOwnerId()) {
      throw new RestaurantDomainError("You are not allowed to perform this action")
    }

    const openingHours = RestaurantOpeningHours.create({
      dayOfWeek: input.dayOfWeek,
      opensAt: input.opensAt,
      closesAt: input.closesAt,
      isClosed: input.isClosed
    })

    restaurant.updateOpeningHours(openingHours)

    await this.restaurantRepo.update(restaurant)
  }
}
