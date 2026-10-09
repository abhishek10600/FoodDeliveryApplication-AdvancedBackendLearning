import { injectable, inject } from "tsyringe"
import { MenuDeactivateUseCase } from "./menu-deactivate.use-case.js";
import { MenuDeactivateInput } from "../../dto/menu/menu-deactivate.dto.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuRepository } from "../../../domain/repositories/menu.repository.js";
import { RestaurantTokens } from "../../../../restaurent/infrastructure/persistence/tokens/restaurant.tokens.js";
import type { IRestaurantRepository } from "../../../../restaurent/domain/repositories/restaurant.repository.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";
import { RestaurantDomainError } from "../../../../restaurent/domain/errors/restaurant-domain.error.js";

@injectable()
export class MenuDeactivateUseCaseImpl implements MenuDeactivateUseCase {
  constructor(

    @inject(MenuTokens.MenuRepository)
    private readonly menuRepo: IMenuRepository,

    @inject(RestaurantTokens.RestaurantRepository)
    private readonly restaurantRepo: IRestaurantRepository

  ) { }

  async execute(input: MenuDeactivateInput): Promise<void> {
    const menu = await this.menuRepo.findById(input.menuId)

    if (!menu) {
      throw new MenuDomainError("Menu not found", 404)
    }

    const restauratnt = await this.restaurantRepo.findById(menu.getRestaurantId())

    if (!restauratnt) {
      throw new RestaurantDomainError("Restaurant not found", 404)
    }

    if (restauratnt.getOwnerId() !== input.ownerId) {
      throw new RestaurantDomainError("You are not authorized to perform this action", 403)
    }

    menu.deactiveateMenu()

    await this.menuRepo.update(input.menuId, menu)
  }
}
