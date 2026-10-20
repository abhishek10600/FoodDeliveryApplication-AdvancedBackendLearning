import { injectable, inject } from "tsyringe"
import { MenuItemAvailabilityUpdateUseCase } from "./menu-item-availability-update.use-case.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import { MenuItemAvailabilityUpdateInput } from "../../dto/menu-item/menu-item-availability-update.dto.js";
import type { IMenuItemRepository } from "../../../domain/repositories/menu-item.repository.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";

@injectable()
export class MenuItemAvailabilityUpdateUseCaseImpl implements MenuItemAvailabilityUpdateUseCase {
  constructor(

    @inject(MenuTokens.MenuItemRepository)
    private readonly menuItemRepo: IMenuItemRepository

  ) { }

  async execute(input: MenuItemAvailabilityUpdateInput): Promise<void> {
    const data = await this.menuItemRepo.findByIdIncludeForeignData(input.id)

    if (!data) {
      throw new MenuDomainError("Menu item not found", 404)
    }

    if (data.restaurant.ownerId !== input.ownerId) {
      throw new MenuDomainError("You are not authorized to perform this action", 403)
    }

    const menuItemEntity = data.menuItem

    menuItemEntity.updateAvailability()

    await this.menuItemRepo.update(input.id, menuItemEntity)

  }
}
