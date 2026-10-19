import { injectable, inject } from "tsyringe"
import { MenuItemDescriptionUpdateUseCase } from "./menu-item-description-update.use-case.js";
import { RestaurantTokens } from "../../../../restaurent/infrastructure/persistence/tokens/restaurant.tokens.js";
import type { IRestaurantRepository } from "../../../../restaurent/domain/repositories/restaurant.repository.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuCategoryRepository } from "../../../domain/repositories/menu-category.repository.js";
import type { IMenuItemRepository } from "../../../domain/repositories/menu-item.repository.js";
import { MenuItemDescriptionUpdateInput } from "../../dto/menu-item/menu-item-description-update.dto.js";
import { RestaurantDomainError } from "../../../../restaurent/domain/errors/restaurant-domain.error.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";
import { MenuItemDescription } from "../../../domain/value-objects/menu-item-description.vo.js";

@injectable()
export class MenuItemDescriptonUpdateUseCaseImpl implements MenuItemDescriptionUpdateUseCase {
  constructor(

    @inject(RestaurantTokens.RestaurantRepository)
    private readonly restaurantRepo: IRestaurantRepository,

    @inject(MenuTokens.MenuCategoryRepository)
    private readonly menuCategoryRepo: IMenuCategoryRepository,

    @inject(MenuTokens.MenuItemRepository)
    private readonly menuItemRepo: IMenuItemRepository

  ) { }

  async execute(input: MenuItemDescriptionUpdateInput): Promise<void> {
    const restaurant = await this.restaurantRepo.findById(input.restaurantId)

    if (!restaurant) {
      throw new RestaurantDomainError("Restaurant not found", 404)
    }

    if (restaurant.getOwnerId() !== input.ownerId) {
      throw new MenuDomainError("You are not allowed to perform this action", 403)
    }

    const menuCategory = await this.menuCategoryRepo.findById(input.menuCategoryId)

    if (!menuCategory) {
      throw new MenuDomainError("Menu category not found", 404)
    }

    const menuItem = await this.menuItemRepo.findById(input.id)

    if (!menuItem) {
      throw new MenuDomainError("Menu item not found", 404)
    }

    menuItem.updateDescription(MenuItemDescription.create(input.description))

    await this.menuItemRepo.update(input.id, menuItem)
  }
}
