import { injectable, inject } from "tsyringe"
import { RestaurantTokens } from "../../../../restaurent/infrastructure/persistence/tokens/restaurant.tokens.js";
import type { IRestaurantRepository } from "../../../../restaurent/domain/repositories/restaurant.repository.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuCategoryRepository } from "../../../domain/repositories/menu-category.repository.js";
import { MenuCategoryStatusUpdateUseCase } from "./menu-category-status-update.use-case.js";
import { MenuCategoryStatusUpdateInput } from "../../dto/menu-category/menu-category-status-update.dto.js";
import { RestaurantDomainError } from "../../../../restaurent/domain/errors/restaurant-domain.error.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";
import { MenuCategoryStatus } from "../../../domain/enums/menu-category-status.enum.js";

@injectable()
export class MenuCategoryStatusUpdateUseCaseImpl implements MenuCategoryStatusUpdateUseCase {
  constructor(

    @inject(RestaurantTokens.RestaurantRepository)
    private readonly restaurantRepo: IRestaurantRepository,

    @inject(MenuTokens.MenuCategoryRepository)
    private readonly menuCategoryRepository: IMenuCategoryRepository

  ) { }

  async execute(input: MenuCategoryStatusUpdateInput): Promise<void> {
    const restaurant = await this.restaurantRepo.findById(input.restaurantId)

    if (!restaurant) {
      throw new RestaurantDomainError("Restaurant not found", 404)
    }

    if (restaurant.getOwnerId() !== input.ownerId) {
      throw new MenuDomainError("You are not authorized to perform this action", 403)
    }

    const menuCategory = await this.menuCategoryRepository.findById(input.id)

    if (!menuCategory) {
      throw new MenuDomainError("Menu catgory not found", 404)
    }

    if (menuCategory.getStatus() === MenuCategoryStatus.ACTIVE) {
      menuCategory.deactivateMenuCategory()
    } else {
      menuCategory.activateMenuCategory()
    }

    await this.menuCategoryRepository.update(input.id, menuCategory)
  }


}
