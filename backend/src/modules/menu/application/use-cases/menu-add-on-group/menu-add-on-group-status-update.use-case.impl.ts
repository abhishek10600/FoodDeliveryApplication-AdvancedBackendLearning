import { injectable, inject } from "tsyringe"
import { MenuAddOnGroupStatusUpdateUseCase } from "./menu-add-on-group-status-update.use-case.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuAddOnGroupRepository } from "../../../domain/repositories/menu-add-on-group.repository.js";
import { MenuAddOnGroupStatusUpdateInput } from "../../dto/menu-add-on-group/menu-add-on-group-status-update.dto.js";
import type { IMenuItemRepository } from "../../../domain/repositories/menu-item.repository.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";
import { MenuAddOnGroupStatus } from "../../../domain/enums/menu-add-on-group-status.enum.js";

@injectable()
export class MenuAddOnGroupStatusUpdateUseCaseImpl implements MenuAddOnGroupStatusUpdateUseCase {
  constructor(

    @inject(MenuTokens.MenuItemRepository)
    private readonly menuItemRepo: IMenuItemRepository,

    @inject(MenuTokens.MenuAddOnGroupRepository)
    private readonly menuAddOnGroupRepo: IMenuAddOnGroupRepository

  ) { }

  async execute(input: MenuAddOnGroupStatusUpdateInput): Promise<void> {
    const data = await this.menuItemRepo.findByIdIncludeForeignData(input.menuItemId)

    if (!data) {
      throw new MenuDomainError("Menu item not found", 404)
    }

    if (data.restaurant.ownerId !== input.ownerId) {
      throw new MenuDomainError("You are not authorized to perform this action", 403)
    }

    const menuAddOnGroup = await this.menuAddOnGroupRepo.findById(input.id)

    if (!menuAddOnGroup) {
      throw new MenuDomainError("Menu add on group not found", 404)
    }

    if (menuAddOnGroup.getMenuItemId() !== data.menuItem.getId()) {
      throw new MenuDomainError("Menu add on group is not present in this menu item", 400)
    }

    if (menuAddOnGroup.getStatus() === MenuAddOnGroupStatus.ACTIVE) {
      console.log("Inside if block")
      console.log({menuAddOnGroupStatus: menuAddOnGroup.getStatus()})
      menuAddOnGroup.deactivateStatus()
      await this.menuAddOnGroupRepo.update(input.id, menuAddOnGroup)
      return
    } else {
      console.log("Inside if block")
      console.log({menuAddOnGroupStatus: menuAddOnGroup.getStatus()})
      menuAddOnGroup.activeteStatus()
      await this.menuAddOnGroupRepo.update(input.id, menuAddOnGroup)
      return
    }
  }

}
