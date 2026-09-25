import { injectable, inject } from "tsyringe";
import { RestaurantCuisineUpdateUseCase } from "./restaurant-cuisine-update.use-case.js";
import { RestaurantTokens } from "../../infrastructure/persistence/tokens/restaurant.tokens.js";
import type { ICuisineRepository } from "../../domain/repositories/cuisine.repository.js";
import { RestaurantCuisineUpdateInput } from "../dto/restaurant-cuisine-update.dto.js";
import type { IRestaurantRepository } from "../../domain/repositories/restaurant.repository.js";
import { RestaurantDomainError } from "../../domain/errors/restaurant-domain.error.js";
import { CuisineName } from "../../domain/value-objects/cuisine-name.vo.js";

@injectable()
export class RestaurantCuisineUpdateUseCaseImpl implements RestaurantCuisineUpdateUseCase {
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

    let cuisineName;

    if (input.cuisineName !== undefined) {
      cuisineName = CuisineName.create(input.cuisineName)

      cuisine.update({
        name: cuisineName
      })

      await this.cuisineRepo.update(cuisine)
    }

    return

  }
}
