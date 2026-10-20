import { injectable, inject } from "tsyringe"
import { MenuItemStatusUpdateUseCase } from "./menu-item-status-update.use-case.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuItemRepository } from "../../../domain/repositories/menu-item.repository.js";
import { MenuItemStatusUpdateInput } from "../../dto/menu-item/menu-item-status-update.dto.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";
import { MenuItemStatus } from "../../../domain/enums/menu-item-status.enum.js";

@injectable()
export class MenuItemStatusUpdateUseCaseImpl implements MenuItemStatusUpdateUseCase {
  constructor(

    @inject(MenuTokens.MenuItemRepository)
    private readonly menuItemRepo: IMenuItemRepository

  ) { }

  async execute(input: MenuItemStatusUpdateInput): Promise<void> {
    const data = await this.menuItemRepo.findByIdIncludeForeignData(input.id)

    if (!data) {
      throw new MenuDomainError("Menu item not found", 404)
    }

    if (data.restaurant.ownerId !== input.ownerId) {
      throw new MenuDomainError("You are not authorized to perform this action", 403)
    }

    const menuItem = data.menuItem

    console.log({menuItemStatus: data.menuItem.getStatus()})

    if (menuItem.getStatus() === MenuItemStatus.ACTIVE) {
      console.log("inside if block of menu item status")
      menuItem.deactivateStatus()
      await this.menuItemRepo.update(input.id, menuItem)
      return
    } else {
      console.log("inside if block of menu item status")
      menuItem.activateStatus()
      await this.menuItemRepo.update(input.id, menuItem)
      return
    }
  }
}
