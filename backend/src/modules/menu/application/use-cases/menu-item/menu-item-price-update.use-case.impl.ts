import { injectable, inject } from "tsyringe"
import { MenuItemPriceUpdateUseCase } from "./menu-item-price-update.use-case.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuItemRepository } from "../../../domain/repositories/menu-item.repository.js";
import { MenuItemPriceUpdateInput } from "../../dto/menu-item/menu-item-price-update.dto.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";

@injectable()
export class MenuItemPriceUpdateUseCaseImpl implements MenuItemPriceUpdateUseCase {
  constructor(

    @inject(MenuTokens.MenuItemRepository)
    private readonly menuItemRepository: IMenuItemRepository

  ) { }

  async execute(input: MenuItemPriceUpdateInput): Promise<void> {
    const menuItem = await this.menuItemRepository.findByIdIncludeForeignData(input.id)

    if (!menuItem) {
      throw new MenuDomainError("Menu item not found", 404)
    }

    if (input.ownerId !== menuItem.restaurant.ownerId) {
      throw new MenuDomainError("You are not authorized to perform this action", 403)
    }

    menuItem.menuItem.updatePrice(input.price)

    await this.menuItemRepository.update(input.id, menuItem.menuItem)
  }
}
