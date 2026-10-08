import { injectable, inject} from "tsyringe"
import { MenuByIdUseCase } from "./menu-by-id.use-case.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuRepository } from "../../../domain/repositories/menu.repository.js";
import { MenuResult } from "../../dto/menu/menu-result.dto.js";
import { MenuInput } from "../../dto/menu/menu.dto.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";
import { MenuResultMapper } from "../../dto/menu/mapper/menu-result-mapper.js";

@injectable()
export class MenuByIdUseCaseImpl implements MenuByIdUseCase {
  constructor(

    @inject(MenuTokens.MenuRepository)
    private readonly menuRepo: IMenuRepository

  ) { }

  async execute(input: MenuInput): Promise<MenuResult> {
    const menu = await this.menuRepo.findById(input.id)

    if (!menu) {
      throw new MenuDomainError("Menu not found", 404)
    }

    return MenuResultMapper.toResult(menu)
  }
}
