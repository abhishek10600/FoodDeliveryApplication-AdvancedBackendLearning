import { injectable, inject } from "tsyringe"
import { MenuAddOnByIdUseCase } from "./menu-add-on-by-id.use-case.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuAddOnRepository } from "../../../domain/repositories/menu-add-on.repository.js";
import { MenuAddOnByIdInput } from "../../dto/menu-add-on/menu-add-on-by-id.dto.js";
import { MenuAddOnResult } from "../../dto/menu-add-on/menu-add-on-result.dto.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";
import { MenuAddOnResultMapper } from "../../dto/menu-add-on/mapper/menu-add-on-result.mapper.js";

@injectable()
export class MenuAddOnByIdUseCaseImpl implements MenuAddOnByIdUseCase {
  constructor(

    @inject(MenuTokens.MenuAddOnRepository)
    private readonly menuAddOnRepository: IMenuAddOnRepository

  ) { }

  async execute(input: MenuAddOnByIdInput): Promise<MenuAddOnResult> {
    const menuAddOn = await this.menuAddOnRepository.findById(input.id)

    if (!menuAddOn) {
      throw new MenuDomainError("Menu add on not found", 404)
    }

    return MenuAddOnResultMapper.toResult(menuAddOn)
  }
}
