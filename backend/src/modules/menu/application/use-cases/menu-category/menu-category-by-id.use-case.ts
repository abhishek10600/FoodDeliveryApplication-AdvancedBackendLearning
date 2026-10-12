import { MenuCategoryByIdInput } from "../../dto/menu-category/menu-category-by-id.dto.js";
import { MenuCategoryResult } from "../../dto/menu-category/menu-category-result.dto.js";

export interface MenuCategoryByIdUseCase {
  execute(input: MenuCategoryByIdInput): Promise<MenuCategoryResult>
}
