import { injectable, inject } from "tsyringe";
import { RestaurantCuisineUpdateInput } from "../dto/restaurant-cuisine-update.dto.js";
import type { RestaurantCuisineUpdateUseCase } from "./restaurant-cuisine-update.use-case.js";
import { RestaurantTokens } from "../../infrastructure/persistence/tokens/restaurant.tokens.js";
import type { IRestaurantRepository } from "../../domain/repositories/restaurant.repository.js";
import type { ICuisineRepository } from "../../domain/repositories/cuisine.repository.js";
import { RestaurantDomainError } from "../../domain/errors/restaurant-domain.error.js";

@injectable()
export class RestaurantCuisineDeletionUseCaseImpl implements RestaurantCuisineUpdateUseCase {
  constructor(

    @inject(RestaurantTokens.RestaurantRepository)
    private readonly restaurantRepo: IRestaurantRepository,

    @inject(RestaurantTokens.CuisineRepository)
    private readonly cuisineRepo: ICuisineRepository

  ) { }

  async execute(input: RestaurantCuisineUpdateInput): Promise<void> {
    const restaurant = await this.restaurantRepo.findById(input.restaurantId)

    if (!restaurant) {
      throw new RestaurantDomainError("Restaurant not found", 404)
    }

    if (input.ownerId !== restaurant.getOwnerId()) {
      throw new RestaurantDomainError("You are not authorized to perform this action", 403)
    }

    const cuisine = await this.cuisineRepo.findById(input.cuisineId)

    if (!cuisine) {
      throw new RestaurantDomainError("Cuisine not found", 404)
    }

    await this.cuisineRepo.delete(cuisine.getId())
  }
}
