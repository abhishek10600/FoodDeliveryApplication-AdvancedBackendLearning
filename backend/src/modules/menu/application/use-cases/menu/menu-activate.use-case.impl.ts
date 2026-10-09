import { injectable, inject } from "tsyringe"
import { MenuActivateInput } from "../../dto/menu/menu-activate.dto.js";
import { MenuActivateUseCase } from "./menu-activate.use-case.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuRepository } from "../../../domain/repositories/menu.repository.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";
import { RestaurantTokens } from "../../../../restaurent/infrastructure/persistence/tokens/restaurant.tokens.js";
import type { IRestaurantRepository } from "../../../../restaurent/domain/repositories/restaurant.repository.js";
import { RestaurantDomainError } from "../../../../restaurent/domain/errors/restaurant-domain.error.js";

@injectable()
export class MenuActivateUseCaseImpl implements MenuActivateUseCase {
  constructor(

    @inject(MenuTokens.MenuRepository)
    private readonly menuRepo: IMenuRepository,

    @inject(RestaurantTokens.RestaurantRepository)
    private readonly restaurantRepo: IRestaurantRepository

  ) { }

  async execute(input: MenuActivateInput): Promise<void> {
    const menu = await this.menuRepo.findById(input.menuId)

    if (!menu) {
      throw new MenuDomainError("Menu not found", 404)
    }

    const restaurant = await this.restaurantRepo.findById(menu.getRestaurantId())

    if (!restaurant) {
      throw new RestaurantDomainError("Restaurant not found", 404)
    }

    if (restaurant.getOwnerId() !== input.ownerId) {
      throw new MenuDomainError("You are not allowed to perform this action", 403)
    }

    console.log({MenuStatus: menu.getStatus()})

    menu.activateMenu()

    await this.menuRepo.update(input.menuId, menu)

  }
}
