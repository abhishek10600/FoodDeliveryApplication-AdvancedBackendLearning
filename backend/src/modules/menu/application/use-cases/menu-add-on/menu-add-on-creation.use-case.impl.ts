import { injectable, inject } from "tsyringe"
import { MenuAddOnCreationUseCase } from "./menu-add-on-creation.use-case.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuAddOnGroupRepository } from "../../../domain/repositories/menu-add-on-group.repository.js";
import type { IMenuAddOnRepository } from "../../../domain/repositories/menu-add-on.repository.js";
import { MenuAddOnCreationInput } from "../../dto/menu-add-on/menu-add-on-creation.dto.js";
import { MenuAddOnResult } from "../../dto/menu-add-on/menu-add-on-result.dto.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";
import { MenuAddOn } from "../../../domain/entities/menu-add-on.entity.js";
import { MenuAddOnName } from "../../../domain/value-objects/menu-add-on-name.vo.js";
import { MenuAddOnResultMapper } from "../../dto/menu-add-on/mapper/menu-add-on-result.mapper.js";

@injectable()
export class MenuAddOnCreationUseCaseImpl implements MenuAddOnCreationUseCase {
  constructor(

    @inject(MenuTokens.MenuAddOnGroupRepository)
    private readonly menuAddOnGroupRepository: IMenuAddOnGroupRepository,

    @inject(MenuTokens.MenuAddOnRepository)
    private readonly menuAddOnRepository: IMenuAddOnRepository

  ) { }

  async execute(input: MenuAddOnCreationInput): Promise<MenuAddOnResult> {
    const data = await this.menuAddOnGroupRepository.findByIdIncludeForeignData(input.menuAddOnGroupId)

    if (!data) {
      throw new MenuDomainError("Menu add on group not found", 404)
    }

    if (data.restaurant.ownerId !== input.ownerId) {
      throw new MenuDomainError("You are not authorized to perform this action", 403)
    }

    const exists = await this.menuAddOnRepository.existsByName(input.menuAddOnGroupId, input.name)

    if (exists) {
      throw new MenuDomainError("Menu add on already exists with this name", 400)
    }

    const menuAddOnEntity = MenuAddOn.create({
      menuAddOnGroupId: input.menuAddOnGroupId,
      name: MenuAddOnName.create(input.name),
      price: input.price,
      currency: input.currency
    })

    const newMenuAddOn = await this.menuAddOnRepository.create(menuAddOnEntity)

    return MenuAddOnResultMapper.toResult(newMenuAddOn)
  }
}
