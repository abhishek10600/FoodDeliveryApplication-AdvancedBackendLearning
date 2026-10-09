import {injectable, inject } from "tsyringe"
import { MenuUpdationUseCase } from "./menu-updation.use-case.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuRepository } from "../../../domain/repositories/menu.repository.js";
import { MenuUpdationInput } from "../../dto/menu/menu-updation.dto.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";
import { RestaurantTokens } from "../../../../restaurent/infrastructure/persistence/tokens/restaurant.tokens.js";
import type { IRestaurantRepository } from "../../../../restaurent/domain/repositories/restaurant.repository.js";
import { RestaurantDomainError } from "../../../../restaurent/domain/errors/restaurant-domain.error.js";
import { MenuName } from "../../../domain/value-objects/menu-name.vo.js";

@injectable()
export class MenuUpdationUseCaseImpl implements MenuUpdationUseCase {
  constructor(

    @inject(MenuTokens.MenuRepository)
    private readonly menuReo: IMenuRepository,

    @inject(RestaurantTokens.RestaurantRepository)
    private readonly restaurantRepo: IRestaurantRepository

  ) { }

  async execute(input: MenuUpdationInput): Promise<void> {
    const menu = await this.menuReo.findById(input.menuId)

    if (!menu) {
      throw new MenuDomainError("Menu not found", 404)
    }

    console.log({MenuRestaurantId: menu.getRestaurantId()})

    const restaurant = await this.restaurantRepo.findById(menu.getRestaurantId())

    console.log({MenuRestaurant: restaurant})

    if (!restaurant) {
      throw new RestaurantDomainError("Restaurant not found", 404)
    }

    if (restaurant.getOwnerId() !== input.ownerId) {
      throw new MenuDomainError("You are not allowed to perform this action", 403)
    }

    menu.updateMenuName(MenuName.create(input.name))

    await this.menuReo.update(input.menuId, menu)

  }
}
