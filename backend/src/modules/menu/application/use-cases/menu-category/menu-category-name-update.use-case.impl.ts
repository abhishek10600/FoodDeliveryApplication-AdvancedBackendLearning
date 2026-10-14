import { injectable, inject } from "tsyringe"
import { MenuCategoryNameUpdateUseCase } from "./menu-category-name-update.use-case.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuCategoryRepository } from "../../../domain/repositories/menu-category.repository.js";
import { MenuCategoryNameUpdateInput } from "../../dto/menu-category/menu-category-name-update.dto.js";
import { RestaurantTokens } from "../../../../restaurent/infrastructure/persistence/tokens/restaurant.tokens.js";
import type { IRestaurantRepository } from "../../../../restaurent/domain/repositories/restaurant.repository.js";
import { RestaurantDomainError } from "../../../../restaurent/domain/errors/restaurant-domain.error.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";
import { MenuCategoryName } from "../../../domain/value-objects/menu-category-name.vo.js";

@injectable()
export class MenuCategoryNameUpdateUseCaseImpl implements MenuCategoryNameUpdateUseCase {
  constructor(

    @inject(RestaurantTokens.RestaurantRepository)
    private readonly restaurantRepo: IRestaurantRepository,

    @inject(MenuTokens.MenuCategoryRepository)
    private readonly menuCategoryRepo: IMenuCategoryRepository

  ) { }

  async execute(input: MenuCategoryNameUpdateInput): Promise<void> {
    const restaurant = await this.restaurantRepo.findById(input.restaurantId)

    if (!restaurant) {
      throw new RestaurantDomainError("Restaurant not found", 404)
    }

    if (restaurant.getOwnerId() !== input.ownerId) {
      throw new MenuDomainError("You are not allowed to perform this action", 403)
    }

    const menuCategory = await this.menuCategoryRepo.findById(input.id)

    if (!menuCategory) {
      throw new MenuDomainError("Menu Category not found", 404)
    }

    const existsByName = await this.menuCategoryRepo.existsByName(menuCategory.getMenuId(), input.menuCategopryName)

    if (existsByName) {
      throw new MenuDomainError("Menu category with this name already exists", 400)
    }

    menuCategory.updateMenuCategoryName(MenuCategoryName.create(input.menuCategopryName))

    await this.menuCategoryRepo.update(input.id, menuCategory)
  }
}
