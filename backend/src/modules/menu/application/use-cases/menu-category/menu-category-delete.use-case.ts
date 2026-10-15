import { MenuCategoryDeleteInput } from "../../dto/menu-category/menu-category-delete.dto.js";

export interface MenuCategoryDeleteUseCase {
  execute(input: MenuCategoryDeleteInput): Promise<void>
}
