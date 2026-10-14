import { MenuCategoryDescriptionUpdateInput } from "../../dto/menu-category/menu-category-description-update.dto.js";

export interface MenuCategoryDescriptionUpdateUseCase {
  execute(input: MenuCategoryDescriptionUpdateInput): Promise<void>
}
