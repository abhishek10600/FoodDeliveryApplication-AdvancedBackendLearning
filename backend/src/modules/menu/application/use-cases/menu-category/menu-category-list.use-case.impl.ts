import { injectable, inject} from "tsyringe"
import { MenuCategoryListUseCase } from "./menu-category-list.use-case.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuCategoryRepository } from "../../../domain/repositories/menu-category.repository.js";
import { MenuCategoryListInput } from "../../dto/menu-category/menu-category-list.dto.js";
import { MenuCategoryResult } from "../../dto/menu-category/menu-category-result.dto.js";
import { MenuCategoryResultMapper } from "../../dto/menu-category/mapper/menu-category-result-mapper.js";

@injectable()
export class MenuCategoryListUseCaseImpl implements MenuCategoryListUseCase {
  constructor(

    @inject(MenuTokens.MenuCategoryRepository)
    private readonly menuCategoryRepo: IMenuCategoryRepository

  ) { }

  async execute(input: MenuCategoryListInput): Promise<MenuCategoryResult[]> {
    const menuCategories = await this.menuCategoryRepo.findByMenuId(input.menuId)

    return menuCategories.map((menuCategory) => MenuCategoryResultMapper.toResult(menuCategory))
  }
}
