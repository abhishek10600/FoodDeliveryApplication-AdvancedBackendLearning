import { injectable, inject } from "tsyringe";
import { RestaurantProfileUseCase } from "./restaurant-profile.use-case.js";
import { RestaurantTokens } from "../../infrastructure/persistence/tokens/restaurant.tokens.js";
import type { IRestaurantRepository } from "../../domain/repositories/restaurant.repository.js";
import { RestaurantProfileResult } from "../dto/restaurant-profile-result.dto.js";
import { NotFoundError } from "../../../../shared/errors/NotFoundError.js";

@injectable()
export class RestaurantProfileUseCaseImpl implements RestaurantProfileUseCase {

  constructor(

    @inject(RestaurantTokens.RestaurantRepository)
    private readonly restaurantRepo: IRestaurantRepository

  ) { }

  async execute(restaurantId: string): Promise<RestaurantProfileResult> {
    const restaurant = await this.restaurantRepo.findById(restaurantId)

    if (!restaurant) {
      throw new NotFoundError("Restaurant not found")
    }

    return {
      id: restaurant.getId(),
      ownerId: restaurant.getOwnerId(),
      name: restaurant.getName().getValue(),
      description: restaurant.getDescription().getValue(),
      email: restaurant.getEmail().getValue(),
      phone: restaurant.getEmail().getValue(),
      address: {
        line1: restaurant.getAddress().getLine1(),
        landMark: restaurant.getAddress().getlandMark(),
        city: restaurant.getAddress().getCity(),
        state: restaurant.getAddress().getState(),
        country: restaurant.getAddress().getCountry(),
        postalCode: restaurant.getAddress().getPostalCode()
      },
      status: restaurant.getStatus(),
      openingHours: restaurant.getOpeningHours().map((hour) => ({
        dayOfWeek: hour.getDayOfWeek(),
        opensAt: hour.getOpensAt() ?? null,
        closesAt: hour.getClosesAt() ?? null,
        isClosed: hour.getIsClosed()
      })),
      createdAt: restaurant.getCreatedAt(),
      updatedAt: restaurant.getUpdatedAt()
    }
  }

}
