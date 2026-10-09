import { injectable, inject } from "tsyringe"
import { MenuDeletionUseCase } from "./menu-deletion.use-case.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuRepository } from "../../../domain/repositories/menu.repository.js";
import { RestaurantTokens } from "../../../../restaurent/infrastructure/persistence/tokens/restaurant.tokens.js";
import type { IRestaurantRepository } from "../../../../restaurent/domain/repositories/restaurant.repository.js";
import { MenuDeletionInput } from "../../dto/menu/menu-deletion.dto.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";
import { RestaurantDomainError } from "../../../../restaurent/domain/errors/restaurant-domain.error.js";

@injectable()
export class MenuDeletionUseCaseImpl implements MenuDeletionUseCase {
  constructor(

    @inject(MenuTokens.MenuRepository)
    private readonly menuRepo: IMenuRepository,

    @inject(RestaurantTokens.RestaurantRepository)
    private readonly restaurantRepo: IRestaurantRepository

  ) { }

  async execute(input: MenuDeletionInput): Promise<void> {
    const menu = await this.menuRepo.findById(input.menuId)

    if (!menu) {
      throw new MenuDomainError("Menu not found", 404)
    }

    const restaurant = await this.restaurantRepo.findById(menu.getRestaurantId())

    if (!restaurant) {
      throw new RestaurantDomainError("Restaurant not found", 404)
    }

    if (restaurant.getOwnerId() !== input.ownerId) {
      throw new MenuDomainError("You are not allowed to perform this action", 404)
    }

    await this.menuRepo.delete(input.menuId)
  }
}
