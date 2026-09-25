import { injectable, inject } from "tsyringe"
import { RestaurantCuisineStatusUpdateInput } from "../dto/restaurant-cuisine-status-update.dto.js";
import { RestaurantCuisineStatusUpdateUseCase } from "./restaurant-cuisine-status-update.use-case.js";
import { RestaurantTokens } from "../../infrastructure/persistence/tokens/restaurant.tokens.js";
import type { IRestaurantRepository } from "../../domain/repositories/restaurant.repository.js";
import type { ICuisineRepository } from "../../domain/repositories/cuisine.repository.js";
import { RestaurantDomainError } from "../../domain/errors/restaurant-domain.error.js";
import { CuisineStatus } from "../../domain/enums/cusine-status.enum.js";

@injectable()
export class RestaurantCuisineStatusUpdateUseCaseImpl implements RestaurantCuisineStatusUpdateUseCase {
  constructor(

    @inject(RestaurantTokens.RestaurantRepository)
    private readonly restaurantRepository: IRestaurantRepository,

    @inject(RestaurantTokens.CuisineRepository)
    private readonly cuisineRepository: ICuisineRepository

  ) { }

  async execute(input: RestaurantCuisineStatusUpdateInput): Promise<void> {
    const restaurant = await this.restaurantRepository.findById(input.restaurantId)

    if (!restaurant) {
      throw new RestaurantDomainError("Restaurant not found", 404)
    }

    if (input.ownerId !== restaurant.getOwnerId()) {
      throw new RestaurantDomainError("You are not authorized to perform this action", 403)
    }

    const cuisine = await this.cuisineRepository.findById(input.cuisineId)

    if (!cuisine) {
      throw new RestaurantDomainError("Cuisine not found", 404)
    }

    if (cuisine.getStatus() === CuisineStatus.ACTIVE) {
      console.log({cuisineStatus: cuisine.getStatus()})
      cuisine.deactivate()
    } else {
      console.log({cuisineStatus: cuisine.getStatus()})
      cuisine.activate()
    }

    await this.cuisineRepository.update(cuisine)
  }
}
