import { injectable, inject } from "tsyringe"
import { MenuCategoryDeleteUseCase } from "./menu-category-delete.use-case.js";
import { RestaurantTokens } from "../../../../restaurent/infrastructure/persistence/tokens/restaurant.tokens.js";
import type { IRestaurantRepository } from "../../../../restaurent/domain/repositories/restaurant.repository.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import { MenuCategoryDeleteInput } from "../../dto/menu-category/menu-category-delete.dto.js";
import { RestaurantDomainError } from "../../../../restaurent/domain/errors/restaurant-domain.error.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";
import type { IMenuCategoryRepository } from "../../../domain/repositories/menu-category.repository.js";

@injectable()
export class MenuCategoryDeleteUseCaseImpl implements MenuCategoryDeleteUseCase {
  constructor(

    @inject(RestaurantTokens.RestaurantRepository)
    private readonly restuarantRepo: IRestaurantRepository,

    @inject(MenuTokens.MenuCategoryRepository)
    private readonly menuCategoryRepo: IMenuCategoryRepository

  ) { }

  async execute(input: MenuCategoryDeleteInput): Promise<void> {
    const restaurant = await this.restuarantRepo.findById(input.restaurantId)

    if (!restaurant) {
      throw new RestaurantDomainError("Restaurant not found", 404)
    }

    if (restaurant.getOwnerId() !== input.ownerId) {
      throw new MenuDomainError("You are not allowed to perform this action", 403)
    }

    const menuCategory = await this.menuCategoryRepo.findById(input.id)

    if (!menuCategory) {
      throw new MenuDomainError("Menu category not found", 404)
    }

    await this.menuCategoryRepo.delete(input.id)
  }
}
