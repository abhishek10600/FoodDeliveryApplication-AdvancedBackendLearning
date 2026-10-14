import { MenuCategoryNameUpdateInput } from "../../dto/menu-category/menu-category-name-update.dto.js";

export interface MenuCategoryNameUpdateUseCase {
  execute(input: MenuCategoryNameUpdateInput): Promise<void>
}
