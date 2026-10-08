import { injectable, inject } from "tsyringe"
import { MenuCreationUseCase } from "./menu-creation.use-case.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuRepository } from "../../../domain/repositories/menu.repository.js";
import { MenuCreationResult } from "../../dto/menu/menu-creation-result.dto.js";
import { MenuCreationInput } from "../../dto/menu/menu-creation.dto.js";
import { Menu } from "../../../domain/entities/menu.entity.js";
import { MenuName } from "../../../domain/value-objects/menu-name.vo.js";
import { MenuResultMapper } from "../../dto/menu/mapper/menu-result-mapper.js";
import { RestaurantTokens } from "../../../../restaurent/infrastructure/persistence/tokens/restaurant.tokens.js";
import type { IRestaurantRepository } from "../../../../restaurent/domain/repositories/restaurant.repository.js";
import { RestaurantDomainError } from "../../../../restaurent/domain/errors/restaurant-domain.error.js";

@injectable()
export class MenuCreationUseCaseImpl implements MenuCreationUseCase {

  constructor(

    @inject(RestaurantTokens.RestaurantRepository)
    private readonly restaurantRepo: IRestaurantRepository,

    @inject(MenuTokens.MenuRepository)
    private readonly menuRepo: IMenuRepository

  ) { }

  async execute(input: MenuCreationInput, ownerId: string): Promise<MenuCreationResult> {

    const restaurant = await this.restaurantRepo.findById(input.restaurantId)

    if (!restaurant) {
      throw new RestaurantDomainError("Restaurant not found", 404)
    }

    if (restaurant.getOwnerId() !== ownerId) {
      throw new RestaurantDomainError("You are not allowed to perform this action", 403)
    }

    const menu = Menu.create({
      restaurantId: input.restaurantId,
      name: MenuName.create(input.name)
    })

    const newMenu = await this.menuRepo.create(menu)

    return MenuResultMapper.toResult(newMenu)
  }

}
