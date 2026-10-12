import { MenuCategoryCreationInput } from "../../dto/menu-category/menu-category-creation.dto.js";
import { MenuCategoryResult } from "../../dto/menu-category/menu-category-result.dto.js";

export interface MenuCategoryCreationUseCase {
  execute(input: MenuCategoryCreationInput): Promise<MenuCategoryResult>
}
