import { injectable, inject } from "tsyringe"
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuCategoryRepository } from "../../../domain/repositories/menu-category.repository.js";
import { RestaurantTokens } from "../../../../restaurent/infrastructure/persistence/tokens/restaurant.tokens.js";
import type { IRestaurantRepository } from "../../../../restaurent/domain/repositories/restaurant.repository.js";
import { MenuCategoryDisplayOrderUpdateUseCase } from "./menu-category-display-order-update.use-case.js";
import { MenuCategoryDisplayOrderUpdateInput } from "../../dto/menu-category/menu-category-display-order-update.dto.js";
import { RestaurantDomainError } from "../../../../restaurent/domain/errors/restaurant-domain.error.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";

@injectable()
export class MenuCategoryDisplayOrderUpdateUseCaseImpl implements MenuCategoryDisplayOrderUpdateUseCase {
  constructor(

    @inject(RestaurantTokens.RestaurantRepository)
    private readonly restaurantRepo: IRestaurantRepository,

    @inject(MenuTokens.MenuCategoryRepository)
    private readonly menuCategoryRepo: IMenuCategoryRepository

  ) { }

  async execute(input: MenuCategoryDisplayOrderUpdateInput): Promise<void> {

    console.log({MenuCategoryDisplayOrderInput: input})

    const restaurant = await this.restaurantRepo.findById(input.restaurantId)

    if (!restaurant) {
      throw new RestaurantDomainError("Restaurant not found", 404)
    }

    if (restaurant.getOwnerId() !== input.ownerId) {
      throw new MenuDomainError("You are not allowed to perform this action", 403)
    }

    const menuCategory = await this.menuCategoryRepo.findById(input.id)

    console.log({MenuCategoryDisplayOrderUseCase_MenuCategory: menuCategory})

    if (!menuCategory) {
      throw new MenuDomainError("Menu category not found", 404)
    }

    menuCategory.updateDisplayOrder(input.displayOrder)

    await this.menuCategoryRepo.update(input.id, menuCategory)
  }
}
