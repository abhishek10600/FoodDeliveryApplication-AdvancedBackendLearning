import { MenuCategoryListInput } from "../../dto/menu-category/menu-category-list.dto.js";
import { MenuCategoryResult } from "../../dto/menu-category/menu-category-result.dto.js";

export interface MenuCategoryListUseCase {
  execute(input: MenuCategoryListInput): Promise<MenuCategoryResult[]>
}
