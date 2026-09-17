import { injectable, inject } from "tsyringe";
import { RestaurantTokens } from "../../infrastructure/persistence/tokens/restaurant.tokens.js";
import type { IRestaurantRepository } from "../../domain/repositories/restaurant.repository.js";
import { RestaurantByOwnerUseCase } from "./restaurant-by-owner.use-case.js";
// import { RestaurantByOwnerResult } from "../dto/restaurant-by-owner-result.dto.js";
import { RestaurantByOwnerInput } from "../dto/restaurant-by-owner.dto.js";
import { IdentityTokens } from "../../../identity/infrastructure/persistence/tokens/identity.tokens.js";
import type { IUserRepository } from "../../../identity/domain/repositories/user.repository.js";
import { NotFoundError } from "../../../../shared/errors/NotFoundError.js";
import { RestaurantByOwnerResult } from "../dto/restaurant-by-owner-result.dto.js";

@injectable()
export class RestaurantByOwnerUseCaseImpl implements RestaurantByOwnerUseCase {
  constructor(

    @inject(RestaurantTokens.RestaurantRepository)
    private readonly restaurantRepo: IRestaurantRepository,

    @inject(IdentityTokens.UserRepository)
    private readonly userRepo: IUserRepository

  ) { }

  async execute(input: RestaurantByOwnerInput): Promise<RestaurantByOwnerResult[]> {
    const ownerId = input.ownerId

    const owner = await this.userRepo.findById(ownerId)

    if (!owner) {
      throw new NotFoundError("Owner not found")
    }

    const restaurants = await this.restaurantRepo.findByOwnerId(ownerId)

    const restaurantResponse: RestaurantByOwnerResult[] = restaurants.map((restaurant) => ({
      Restaurant: {
        id: restaurant.getId(),
        name: restaurant.getName().getValue(),
        description: restaurant.getDescription().getValue(),
        status: restaurant.getStatus(),
        phone: restaurant.getPhone().getValue(),
        email: restaurant.getEmail().getValue(),
        address: {
          line1: restaurant.getAddress().getLine1(),
          landMark: restaurant.getAddress().getlandMark(),
          city: restaurant.getAddress().getCity(),
          state: restaurant.getAddress().getState(),
          country: restaurant.getAddress().getCountry(),
          postalCode: restaurant.getAddress().getPostalCode()
        }
      }
    }))

    return restaurantResponse
  }
}
