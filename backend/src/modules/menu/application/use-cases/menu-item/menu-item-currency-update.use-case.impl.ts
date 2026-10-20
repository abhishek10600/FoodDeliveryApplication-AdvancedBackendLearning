import { injectable, inject } from "tsyringe"
import { MenuItemCurrencyUpdateUseCase } from "./menu-item-currency-update.use-case.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuItemRepository } from "../../../domain/repositories/menu-item.repository.js";
import { MenuItemCurrencyUpdateInput } from "../../dto/menu-item/menu-item-currency-update.dto.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";

@injectable()
export class MenuItemCurrencyUpdateUseCaseImpl implements MenuItemCurrencyUpdateUseCase {
  constructor(

    @inject(MenuTokens.MenuItemRepository)
    private readonly menuItemRepo: IMenuItemRepository

  ) { }

  async execute(input: MenuItemCurrencyUpdateInput): Promise<void> {
    const data = await this.menuItemRepo.findByIdIncludeForeignData(input.id)

    if (!data) {
      throw new MenuDomainError("Menu item not found", 404)
    }

    if (input.ownerId !== data.restaurant.ownerId) {
      throw new MenuDomainError("You are not authorized to perform this action", 403)
    }

    data.menuItem.updateCurrency(input.currency)

    await this.menuItemRepo.update(input.id, data.menuItem)

  }
}
