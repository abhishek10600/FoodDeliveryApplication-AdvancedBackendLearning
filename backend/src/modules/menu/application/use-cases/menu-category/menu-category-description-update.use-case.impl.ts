import { injectable, inject } from "tsyringe"
import { MenuCategoryDescriptionUpdateUseCase } from "./menu-category-description-update.use-case.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuCategoryRepository } from "../../../domain/repositories/menu-category.repository.js";
import { RestaurantTokens } from "../../../../restaurent/infrastructure/persistence/tokens/restaurant.tokens.js";
import type { IRestaurantRepository } from "../../../../restaurent/domain/repositories/restaurant.repository.js";
import { MenuCategoryDescriptionUpdateInput } from "../../dto/menu-category/menu-category-description-update.dto.js";
import { RestaurantDomainError } from "../../../../restaurent/domain/errors/restaurant-domain.error.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";
import { MenuCategoryDescription } from "../../../domain/value-objects/menu-category-description.vo.js";

@injectable()
export class MenuCategoryDescriptionUpdateUseCaseImpl implements MenuCategoryDescriptionUpdateUseCase {
  constructor(

    @inject(RestaurantTokens.RestaurantRepository)
    private readonly restaurantRepo: IRestaurantRepository,

    @inject(MenuTokens.MenuCategoryRepository)
    private readonly menuCategoryRepo: IMenuCategoryRepository

  ) { }

  async execute(input: MenuCategoryDescriptionUpdateInput): Promise<void> {
    const restaurant = await this.restaurantRepo.findById(input.restaurantId)

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

    menuCategory.updateMenuCategoryDescription(MenuCategoryDescription.create(input.menuCategoryDescription))

    await this.menuCategoryRepo.update(input.id, menuCategory)
  }
}
