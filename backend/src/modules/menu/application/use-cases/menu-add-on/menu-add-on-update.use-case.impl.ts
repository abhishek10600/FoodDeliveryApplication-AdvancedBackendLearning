import { injectable, inject } from "tsyringe"
import { MenuAddOnUpdateUseCase } from "./menu-add-on-update.use-case.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuAddOnGroupRepository } from "../../../domain/repositories/menu-add-on-group.repository.js";
import type { IMenuAddOnRepository } from "../../../domain/repositories/menu-add-on.repository.js";
import { MenuAddOnUpdateInput } from "../../dto/menu-add-on/menu-add-on-update.dto.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";
import { MenuAddOnName } from "../../../domain/value-objects/menu-add-on-name.vo.js";

@injectable()
export class MenuAddOnUpdateUseCaseImpl implements MenuAddOnUpdateUseCase {
  constructor(

    @inject(MenuTokens.MenuAddOnGroupRepository)
    private readonly menuAddOnGroupRepo: IMenuAddOnGroupRepository,

    @inject(MenuTokens.MenuAddOnRepository)
    private readonly menuAddOnRepo: IMenuAddOnRepository

  ) { }

  async execute(input: MenuAddOnUpdateInput): Promise<void> {
    const data = await this.menuAddOnGroupRepo.findByIdIncludeForeignData(input.menuAddOnGroupId)

    if (!data) {
      throw new MenuDomainError("Menu add on group not found", 404)
    }

    if (data.restaurant.ownerId !== input.ownerId) {
      throw new MenuDomainError("You are not allowed to perform this action", 403)
    }

    const menuAddOn = await this.menuAddOnRepo.findById(input.id)

    if (!menuAddOn) {
      throw new MenuDomainError("Menu add on not found", 404)
    }

    if (menuAddOn.getMenuAddOnGroupId() !== data.menuAddOnGroup.getId()) {
      throw new MenuDomainError("Menu add on not found in thui menu add on group", 400)
    }

    if (input.name !== undefined) {
      const exists = await this.menuAddOnRepo.existsByName(input.menuAddOnGroupId, input.name)

      if (exists) {
        throw new MenuDomainError("Menu add on with this name already exists in this menu add on group", 400)
      }

      menuAddOn.updateName(MenuAddOnName.create(input.name))
    }

    if (input.price !== undefined) {
      menuAddOn.changePrice(input.price)
    }

    if (input.currency !== undefined) {
      menuAddOn.changeCurrency(input.currency)
    }

    if (input.displayOrder !== undefined) {
      menuAddOn.changeDisplayOrder(input.displayOrder)
    }

    await this.menuAddOnRepo.update(input.id, menuAddOn)
  }
}
