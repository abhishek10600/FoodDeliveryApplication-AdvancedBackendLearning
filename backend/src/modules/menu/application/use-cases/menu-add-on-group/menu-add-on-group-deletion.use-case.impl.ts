import { injectable, inject } from "tsyringe"
import { MenuAddOnGroupDeletionUseCase } from "./menu-add-on-group-deletion.use-case.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuItemRepository } from "../../../domain/repositories/menu-item.repository.js";
import type { IMenuAddOnGroupRepository } from "../../../domain/repositories/menu-add-on-group.repository.js";
import { MenuAddOnGroupDeletionInput } from "../../dto/menu-add-on-group/menu-add-on-group-deletion.dto.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";

@injectable()
export class MenuAddOnGroupDeletionUseCaseImpl implements MenuAddOnGroupDeletionUseCase {
  constructor(

    @inject(MenuTokens.MenuItemRepository)
    private readonly menuItemRepo: IMenuItemRepository,

    @inject(MenuTokens.MenuAddOnGroupRepository)
    private readonly menuAddOnGroupRepo: IMenuAddOnGroupRepository

  ) { }

  async execute(input: MenuAddOnGroupDeletionInput): Promise<void> {
    const data = await this.menuItemRepo.findByIdIncludeForeignData(input.menuItemId)

    if (!data) {
      throw new MenuDomainError("Menu item not found", 404)
    }

    if (data.restaurant.ownerId !== input.ownerId) {
      throw new MenuDomainError("You are not allowed to perform this action", 403)
    }

    const menuAddOnGroup = await this.menuAddOnGroupRepo.findById(input.id)

    if (!menuAddOnGroup) {
      throw new MenuDomainError("Menu add on group now found", 404)
    }

    if (menuAddOnGroup.getMenuItemId() !== data.menuItem.getId()) {
      throw new MenuDomainError("Menu add on group not present in this menu item", 400)
    }

    await this.menuAddOnGroupRepo.delete(input.id)

  }
}
