import { injectable, inject } from "tsyringe"
import { MenuItemByIdUseCase } from "./menu-item-by-id.use-case.js";
import { MenuItemByIdInput } from "../../dto/menu-item/menu-item-by-id.dto.js";
import { MenuItemResult } from "../../dto/menu-item/menu-item-result.dto.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuItemRepository } from "../../../domain/repositories/menu-item.repository.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";
import { MenuItemResultMapper } from "../../dto/menu-item/mapper/menu-item-result-mapper.js";

@injectable()
export class MenuItemByIdUseCaseImpl implements MenuItemByIdUseCase {
  constructor(

    @inject(MenuTokens.MenuItemRepository)
    private readonly menuItemRepo: IMenuItemRepository

  ) { }

  async execute(input: MenuItemByIdInput): Promise<MenuItemResult> {
    const menuItem = await this.menuItemRepo.findById(input.id)

    if (!menuItem) {
      throw new MenuDomainError("Menu item not found", 404)
    }

    return MenuItemResultMapper.toResult(menuItem)
  }
}
