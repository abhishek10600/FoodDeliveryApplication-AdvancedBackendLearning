import { injectable, inject } from "tsyringe"
import { RestaurantCuisineCreationInput } from "../dto/restaurant-cuisine-creation.dto.js";
import { RestaurantCuisineCreationUseCase } from "./restaurant-cuisine-creation.use-case.js";
import { RestaurantTokens } from "../../infrastructure/persistence/tokens/restaurant.tokens.js";
import type { IRestaurantRepository } from "../../domain/repositories/restaurant.repository.js";
import { RestaurantDomainError } from "../../domain/errors/restaurant-domain.error.js";
import { CuisineName } from "../../domain/value-objects/cuisine-name.vo.js";
import { Cuisine } from "../../domain/entities/cuisine.entity.js";
import type { IRestaurantTransaction } from "../transaction/restaurant.transaction.js";
import { RestaurantCuisine } from "../../domain/entities/restaurant-cuisine.entity.js";

@injectable()
export class RestaurantCuisineCreationUseCaseImpl implements RestaurantCuisineCreationUseCase {
  constructor(

    @inject(RestaurantTokens.RestaurantRepository)
    private readonly restaurantRepo: IRestaurantRepository,

    @inject(RestaurantTokens.Transaction)
    private readonly transaction: IRestaurantTransaction

  ) { }

  async execute(input: RestaurantCuisineCreationInput): Promise<void> {
    const restaurant = await this.restaurantRepo.findById(input.restaurantId)

    if (!restaurant) {
      throw new RestaurantDomainError("Restaurant not found", 404)
    }

    if (input.ownerId !== restaurant.getOwnerId()) {
      throw new RestaurantDomainError("You are not allowed to perform this action", 403)
    }


    const cuisineName = CuisineName.create(input.cuisineName)

    const cuisine = Cuisine.create({
      name: cuisineName
    })

    await this.transaction.execute(async ({
      restaurantRepository,
      cuisineRepository
    }) => {
      const createdCuisine = await cuisineRepository.create(cuisine)

      const restaurantCuisine = RestaurantCuisine.create({
        restaurantId: input.restaurantId,
        cuisineId: createdCuisine.getId()
      })

      const createdRestaurantCuisine = await restaurantRepository.createRestaurantCuisine(restaurantCuisine)

      restaurant.addCuisine(createdRestaurantCuisine.getCuisineId())

      await restaurantRepository.update(restaurant)
    })

  }
}
