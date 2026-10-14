import { MenuCategoryDisplayOrderUpdateInput } from "../../dto/menu-category/menu-category-display-order-update.dto.js";

export interface MenuCategoryDisplayOrderUpdateUseCase {
  execute(input: MenuCategoryDisplayOrderUpdateInput): Promise<void>
}
