import { MenuCategoryStatusUpdateInput } from "../../dto/menu-category/menu-category-status-update.dto.js";

export interface MenuCategoryStatusUpdateUseCase {
  execute(input: MenuCategoryStatusUpdateInput): Promise<void>
}
