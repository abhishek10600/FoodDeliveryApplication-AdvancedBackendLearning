import { injectable, inject } from "tsyringe";
import { RestaurantProfileUpdateUseCase } from "./restaurant-profile-update.use-case.js";
import { RestaurantTokens } from "../../infrastructure/persistence/tokens/restaurant.tokens.js";
import type { IRestaurantRepository } from "../../domain/repositories/restaurant.repository.js";
import { RestaurantProfileUpdateInput } from "../dto/restaurant-profile-update.dto.js";
import { RestaurantDomainError } from "../../domain/errors/restaurant-domain.error.js";
import { RestaurantName } from "../../domain/value-objects/restaurant-name.vo.js";
import { RestaurantDescription } from "../../domain/value-objects/restaurant-description.vo.js";
import { RestaurantPhone } from "../../domain/value-objects/restaurant-phone.vo.js";
import { RestaurantEmail } from "../../domain/value-objects/restaurant-email.vo.js";
import { RestaurantAddress } from "../../domain/value-objects/restaurant-address.vo.js";

@injectable()
export class RestaurantProfileUpdateUseCaseImpl implements RestaurantProfileUpdateUseCase {
  constructor(

    @inject(RestaurantTokens.RestaurantRepository)
    private readonly restaurantRepo: IRestaurantRepository

  ) { }

  async execute(restaurantId: string, ownerId: string, input: RestaurantProfileUpdateInput): Promise<void> {

    console.log({ restaurantId })
    console.log({ownerId})

    const restaurant = await this.restaurantRepo.findById(restaurantId)

    console.log({restaurant})

    if (!restaurant) {
      throw new RestaurantDomainError("Restaurant not found")
    }

    if (restaurant.getOwnerId() !== ownerId) {
      throw new RestaurantDomainError("You are not authorized to perform this action")
    }

    restaurant.updateProfile({
      name: input.name !== undefined ? RestaurantName.create(input.name) : undefined,
      description: input.description !== undefined ? RestaurantDescription.create(input.description) : undefined,
      phone: input.phone !== undefined ? RestaurantPhone.create(input.phone) : undefined,
      email: input.email !== undefined ? RestaurantEmail.create(input.email) : undefined,
      address: input.address !== undefined ? RestaurantAddress.create(input.address) : undefined
    })

    await this.restaurantRepo.update(restaurant)
  }
}
