import { injectable, inject } from "tsyringe"
import { MenuByRestaurantIdUseCase } from "./menu-by-restaurant-id.use-case.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuRepository } from "../../../domain/repositories/menu.repository.js";
import { MenuByRestaurantIdInput } from "../../dto/menu/menu-by-restaurant-id.dto.js";
import { MenuResult } from "../../dto/menu/menu-result.dto.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";
import { MenuResultMapper } from "../../dto/menu/mapper/menu-result-mapper.js";

@injectable()
export class MenuByRestaurantIdUseCaseImpl implements MenuByRestaurantIdUseCase {
  constructor(

    @inject(MenuTokens.MenuRepository)
    private readonly menuRepo: IMenuRepository

  ) { }

  async execute(input: MenuByRestaurantIdInput): Promise<MenuResult> {
    const menu = await this.menuRepo.findByRestaurantId(input.restaurantId)

    console.log({menuByRestaurantId: menu})

    if (!menu) {
      throw new MenuDomainError("Menu not found", 404)
    }

    return MenuResultMapper.toResult(menu)
  }
}
