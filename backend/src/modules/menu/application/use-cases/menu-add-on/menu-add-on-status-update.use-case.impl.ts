import { injectable, inject } from "tsyringe"
import { MenuAddOnStatusUpdateUseCase } from "./menu-add-on-status-update.use-case.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuAddOnGroupRepository } from "../../../domain/repositories/menu-add-on-group.repository.js";
import type { IMenuAddOnRepository } from "../../../domain/repositories/menu-add-on.repository.js";
import { MenuAddOnStatusUpdateInput } from "../../dto/menu-add-on/menu-add-on-status-update.dto.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";
import { MenuAddOnStatus } from "../../../domain/enums/menu-add-on-status.enum.js";

@injectable()
export class MenuAddOnStatusUpdateUseCaseImpl implements MenuAddOnStatusUpdateUseCase {

  constructor(

    @inject(MenuTokens.MenuAddOnGroupRepository)
    private readonly menuAddOnGroupRepo: IMenuAddOnGroupRepository,

    @inject(MenuTokens.MenuAddOnRepository)
    private readonly menuAddOnRepo: IMenuAddOnRepository

  ) { }

  async execute(input: MenuAddOnStatusUpdateInput): Promise<void> {
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
      throw new MenuDomainError("Menu add on not found in this menu add on group", 400)
    }

    if (menuAddOn.getStatus() === MenuAddOnStatus.ACTIVE) {
      menuAddOn.deactivateStatus()
    } else {
      menuAddOn.activateStatus()
    }

    await this.menuAddOnRepo.update(input.id, menuAddOn)

  }

}
