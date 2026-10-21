import { injectable, inject } from "tsyringe"
import { MenuAddOnGroupCreationUseCase } from "./menu-add-on-group-creation.use-case.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuItemRepository } from "../../../domain/repositories/menu-item.repository.js";
import { MenuAddOnGroupCreationInput } from "../../dto/menu-add-on-group/menu-add-on-group-creation.dto.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";
import type { IMenuAddOnGroupRepository } from "../../../domain/repositories/menu-add-on-group.repository.js";
import { MenuAddOnGroupName } from "../../../domain/value-objects/menu-add-on-group-name.vo.js";
import { MenuAddOnGroup } from "../../../domain/entities/menu-add-on-group.entity.js";
import { MenuAddOnGroupResultMapper } from "../../dto/menu-add-on-group/mapper/menu-add-on-group-result.mapper.js";

@injectable()
export class MenuAddOnGroupCreationUseCaseImpl implements MenuAddOnGroupCreationUseCase {
  constructor(

    @inject(MenuTokens.MenuItemRepository)
    private readonly menuItemRepo: IMenuItemRepository,

    @inject(MenuTokens.MenuAddOnGroupRepository)
    private readonly menuAddOnGroupRepo: IMenuAddOnGroupRepository

  ) { }

  async execute(input: MenuAddOnGroupCreationInput): Promise<unknown> {
    const data = await this.menuItemRepo.findByIdIncludeForeignData(input.menuItemId)

    if (!data) {
      throw new MenuDomainError("Menu item not found", 404)
    }

    if (data.restaurant.ownerId !== input.ownerId) {
      throw new MenuDomainError("You are not allowed to perform this action", 403)
    }

    const exists = await this.menuAddOnGroupRepo.existsByName(input.menuItemId, input.name)

    if (exists) {
      throw new MenuDomainError("Menu add on group with this name already exists for this menu item", 400)
    }

    const menuAddOnGroupEntity = MenuAddOnGroup.create({
      menuItemId: input.menuItemId,
      name: MenuAddOnGroupName.create(input.name)
    })

    const newMenuAddOnGroup = await this.menuAddOnGroupRepo.create(menuAddOnGroupEntity)

    return MenuAddOnGroupResultMapper.toResult(newMenuAddOnGroup)

  }
}
