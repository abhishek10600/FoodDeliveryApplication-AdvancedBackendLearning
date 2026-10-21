import { injectable, inject } from "tsyringe"
import { MenuAddOnGroupByMenuItemIdUseCase } from "./menu-add-on-group-by-menu-item-id.use-case.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuItemRepository } from "../../../domain/repositories/menu-item.repository.js";
import type { IMenuAddOnGroupRepository } from "../../../domain/repositories/menu-add-on-group.repository.js";
import { MenuAddOnGroupsByMenuItemIdInput } from "../../dto/menu-add-on-group/menu-add-on-group-by-menu-item-id.dto.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";
import { MenuAddOnGroupResultMapper } from "../../dto/menu-add-on-group/mapper/menu-add-on-group-result.mapper.js";
import { MenuAddOnGroupResult } from "../../dto/menu-add-on-group/menu-add-on-group-result.dto.js";

@injectable()
export class MenuAddOnGroupByMenuItemIdUseCaseImpl implements MenuAddOnGroupByMenuItemIdUseCase {
  constructor(

    @inject(MenuTokens.MenuItemRepository)
    private readonly menuItemRepo: IMenuItemRepository,

    @inject(MenuTokens.MenuAddOnGroupRepository)
    private readonly menuAddOnGroupRepo: IMenuAddOnGroupRepository

  ) { }

  async execute(input: MenuAddOnGroupsByMenuItemIdInput): Promise<MenuAddOnGroupResult[]> {
    const menuItem = await this.menuItemRepo.findById(input.menuItemId)

    if (!menuItem) {
      throw new MenuDomainError("Menu item not found", 404)
    }

    const menuAddOnGroups = await this.menuAddOnGroupRepo.findByMenuItemId(input.menuItemId)

    return menuAddOnGroups.map((menuAddOnGroup) => MenuAddOnGroupResultMapper.toResult(menuAddOnGroup))

  }
}
