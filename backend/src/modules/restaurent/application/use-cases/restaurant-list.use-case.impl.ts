import { injectable, inject} from "tsyringe"
import { RestaurantListUseCase } from "./restaurant-list.use-case.js";
import { RestaurantTokens } from "../../infrastructure/persistence/tokens/restaurant.tokens.js";
import type { IRestaurantRepository } from "../../domain/repositories/restaurant.repository.js";
import { RestaurantListFilterInput } from "../dto/resruarant-list.dto.js";
import { RestaurantListResult } from "../dto/restaurant-list-response.dto.js";

@injectable()
export class RestaurantListUseCaseImpl implements RestaurantListUseCase {
  constructor(

    @inject(RestaurantTokens.RestaurantRepository)
    private readonly restaurantRepo: IRestaurantRepository

  ) { }

  async execute(filters: RestaurantListFilterInput): Promise<RestaurantListResult> {

    return await this.restaurantRepo.get(filters)
  }
}
