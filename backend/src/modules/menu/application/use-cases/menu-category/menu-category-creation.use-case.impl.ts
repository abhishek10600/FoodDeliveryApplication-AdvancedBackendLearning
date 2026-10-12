import { injectable, inject } from "tsyringe"
import { MenuCategoryCreationInput } from "../../dto/menu-category/menu-category-creation.dto.js";
import { MenuCategoryResult } from "../../dto/menu-category/menu-category-result.dto.js";
import { MenuCategoryCreationUseCase } from "./menu-category-creation.use-case.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuCategoryRepository } from "../../../domain/repositories/menu-category.repository.js";
import type { IMenuRepository } from "../../../domain/repositories/menu.repository.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";
import { RestaurantTokens } from "../../../../restaurent/infrastructure/persistence/tokens/restaurant.tokens.js";
import type { IRestaurantRepository } from "../../../../restaurent/domain/repositories/restaurant.repository.js";
import { RestaurantDomainError } from "../../../../restaurent/domain/errors/restaurant-domain.error.js";
import { MenuCategory } from "../../../domain/entities/menu-cateogry.entity.js";
import { MenuCategoryName } from "../../../domain/value-objects/menu-category-name.vo.js";
import { MenuCategoryDescription } from "../../../domain/value-objects/menu-category-description.vo.js";
import { MenuCategoryResultMapper } from "../../dto/menu-category/mapper/menu-category-result-mapper.js";

@injectable()
export class MenuCategoryCreationUseCaseImpl implements MenuCategoryCreationUseCase {
  constructor(

    @inject(RestaurantTokens.RestaurantRepository)
    private readonly restaurantRepo: IRestaurantRepository,

    @inject(MenuTokens.MenuRepository)
    private readonly menuRepo: IMenuRepository,

    @inject(MenuTokens.MenuCategoryRepository)
    private readonly menuCategoryRepo: IMenuCategoryRepository

  ) { }

  async execute(input: MenuCategoryCreationInput): Promise<MenuCategoryResult> {
    const menu = await this.menuRepo.findById(input.menuId)

    if (!menu) {
      throw new MenuDomainError("Menu not found", 404)
    }

    const exists = await this.menuCategoryRepo.existsByName(input.menuId, input.name)

    if (exists) {
      throw new MenuDomainError("Menu category with this name already exists", 400)
    }

    const restaurant = await this.restaurantRepo.findById(menu.getRestaurantId())

    if (!restaurant) {
      throw new RestaurantDomainError("Restaurant not found", 404)
    }

    if (restaurant.getOwnerId() !== input.ownerId) {
      throw new MenuDomainError("You are not allowed to perform this action", 403)
    }

    const menuCategory = MenuCategory.create({
      menuId: input.menuId,
      name: MenuCategoryName.create(input.name),
      description: input.description ? MenuCategoryDescription.create(input.description) : undefined,
    })

    const newMenuCategory = await this.menuCategoryRepo.create(menuCategory)

    return MenuCategoryResultMapper.toResult(newMenuCategory)
  }
}
