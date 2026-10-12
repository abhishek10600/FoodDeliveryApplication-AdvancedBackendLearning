import { injectable, inject } from "tsyringe"
import { MenuCategoryByIdInput } from "../../dto/menu-category/menu-category-by-id.dto.js";
import { MenuCategoryResult } from "../../dto/menu-category/menu-category-result.dto.js";
import { MenuCategoryByIdUseCase } from "./menu-category-by-id.use-case.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuCategoryRepository } from "../../../domain/repositories/menu-category.repository.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";
import { MenuCategoryResultMapper } from "../../dto/menu-category/mapper/menu-category-result-mapper.js";

@injectable()
export class MenuCategoryByIdUseCaseImpl implements MenuCategoryByIdUseCase {
  constructor(

    @inject(MenuTokens.MenuCategoryRepository)
    private readonly menuCategoryRepo: IMenuCategoryRepository

  ) { }

  async execute(input: MenuCategoryByIdInput): Promise<MenuCategoryResult> {
    const menuCategory = await this.menuCategoryRepo.findById(input.id)

    console.log({menuCategoryUseCaseValue: menuCategory})

    if (!menuCategory) {
      throw new MenuDomainError("Menu not found", 404)
    }

    return MenuCategoryResultMapper.toResult(menuCategory)
  }
}
