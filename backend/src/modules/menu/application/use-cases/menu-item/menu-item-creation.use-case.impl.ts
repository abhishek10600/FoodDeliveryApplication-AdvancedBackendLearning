import { injectable, inject } from "tsyringe"
import { MenuItemCreationUseCase } from "./menu-item-creation.use-case.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuItemRepository } from "../../../domain/repositories/menu-item.repository.js";
import { MenuItemCreationInput } from "../../dto/menu-item/menu-item-creation.dto.js";
import { MenuItemResult } from "../../dto/menu-item/menu-item-result.dto.js";
import { RestaurantTokens } from "../../../../restaurent/infrastructure/persistence/tokens/restaurant.tokens.js";
import type { IRestaurantRepository } from "../../../../restaurent/domain/repositories/restaurant.repository.js";
import { RestaurantDomainError } from "../../../../restaurent/domain/errors/restaurant-domain.error.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";
import type { IMenuCategoryRepository } from "../../../domain/repositories/menu-category.repository.js";
import { MenuItem } from "../../../domain/entities/menu-item.entity.js";
import { MenuItemName } from "../../../domain/value-objects/menu-item-name.vo.js";
import { MenuItemDescription } from "../../../domain/value-objects/menu-item-description.vo.js";
import { MenuItemResultMapper } from "../../dto/menu-item/mapper/menu-item-result-mapper.js";

@injectable()
export class MenuItemCreationUseCaseImpl implements MenuItemCreationUseCase {
  constructor(

    @inject(RestaurantTokens.RestaurantRepository)
    private readonly restaurantRepo: IRestaurantRepository,

    @inject(MenuTokens.MenuCategoryRepository)
    private readonly menuCategoryRepo: IMenuCategoryRepository,

    @inject(MenuTokens.MenuItemRepository)
    private readonly menuItemRepo: IMenuItemRepository

  ) { }

  async execute(input: MenuItemCreationInput): Promise<MenuItemResult> {
    const restaurant = await this.restaurantRepo.findById(input.restaurantId)

    if (!restaurant) {
      throw new RestaurantDomainError("Restaurant not found", 404)
    }

    if (restaurant.getOwnerId() !== input.ownerId) {
      throw new MenuDomainError("You are not authorized to perform this action", 403)
    }

    const menuCategory = await this.menuCategoryRepo.findById(input.menuCategoryId)

    if (!menuCategory) {
      throw new MenuDomainError("Menu category not found", 404)
    }

    const exists = await this.menuItemRepo.existsByName(input.menuCategoryId, input.name)

    if (exists) {
      throw new MenuDomainError("Menu item with this name already exists", 400)
    }

    const menuItem = MenuItem.create({
      menuCategoryId: input.menuCategoryId,
      name: MenuItemName.create(input.name),
      description: input.description ? MenuItemDescription.create(input.description) : null,
      imageUrl: null,
      price: input.price,
      currency: input.currency,
      displayOrder: 0
    })

    const newMenuItem = await this.menuItemRepo.create(menuItem)

    return MenuItemResultMapper.toResult(newMenuItem)
  }
}
