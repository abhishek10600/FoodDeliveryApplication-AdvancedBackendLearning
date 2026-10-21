import { injectable, inject } from "tsyringe"
import { MenuAddOnGroupUpdateUseCase } from "./menu-add-on-group-update.use-case.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuItemRepository } from "../../../domain/repositories/menu-item.repository.js";
import type { IMenuAddOnGroupRepository } from "../../../domain/repositories/menu-add-on-group.repository.js";
import { MenuAddOnGroupUpdateInput } from "../../dto/menu-add-on-group/menu-add-on-group-update.dto.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";
import { MenuAddOnGroupName } from "../../../domain/value-objects/menu-add-on-group-name.vo.js";

@injectable()
export class MenuAddOnGroupUpdateUseCaseImpl implements MenuAddOnGroupUpdateUseCase {
  constructor(

    @inject(MenuTokens.MenuItemRepository)
    private readonly menuItemRepo: IMenuItemRepository,

    @inject(MenuTokens.MenuAddOnGroupRepository)
    private readonly menuAddOnGroupRepo: IMenuAddOnGroupRepository

  ) { }

  async execute(input: MenuAddOnGroupUpdateInput): Promise<void> {
    const data = await this.menuItemRepo.findByIdIncludeForeignData(input.menuItemId)

    if (!data) {
      throw new MenuDomainError("Menu item not found", 404)
    }

    if (data.restaurant.ownerId !== input.ownerId) {
      throw new MenuDomainError("You are not allowed to perform this action", 403)
    }

    const menuAddOnGroup = await this.menuAddOnGroupRepo.findById(input.id)

    if (!menuAddOnGroup) {
      throw new MenuDomainError("Menu add on group not found", 404)
    }

    if (menuAddOnGroup.getMenuItemId() !== input.menuItemId) {
      throw new MenuDomainError("Invalid menu item id for menu group", 400)
    }

    if (input.name !== undefined) {
      const exists = await this.menuAddOnGroupRepo.existsByName(input.menuItemId, input.name)

      if (exists) {
        throw new MenuDomainError("Menu add on group with this name already exists for this menu item", 400)
      }

      menuAddOnGroup.update({
        name: MenuAddOnGroupName.create(input.name)
      })
    }

    if (input.minSelections !== undefined) {
      menuAddOnGroup.update({
        minSelection: input.minSelections
      })
    }

    if (input.maxSelections !== undefined) {
      menuAddOnGroup.update({
        maxSelections: input.maxSelections
      })
    }

    if (input.displayOrder !== undefined) {
      menuAddOnGroup.changeDisplayOrder(input.displayOrder)
    }

    await this.menuAddOnGroupRepo.update(input.id, menuAddOnGroup)

  }
}
