import { injectable, inject } from "tsyringe"
import { MenuItemDeletionUseCase } from "./menu-item-deletion.use-case.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuItemRepository } from "../../../domain/repositories/menu-item.repository.js";
import { MenuItemDeletionInput } from "../../dto/menu-item/menu-item-deletion.dto.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";

@injectable()
export class MenuItemDeletionUseCaseImpl implements MenuItemDeletionUseCase {
  constructor(

    @inject(MenuTokens.MenuItemRepository)
    private readonly menuItemRepo: IMenuItemRepository

  ) { }

  async execute(input: MenuItemDeletionInput): Promise<void> {
    const data = await this.menuItemRepo.findByIdIncludeForeignData(input.id)

    if (!data) {
      throw new MenuDomainError("Menu item not found", 404)
    }

    if (data.restaurant.ownerId !== input.ownerId) {
      throw new MenuDomainError("You are not authorized to perform this action", 403)
    }

    await this.menuItemRepo.delete(input.id)
  }
}
