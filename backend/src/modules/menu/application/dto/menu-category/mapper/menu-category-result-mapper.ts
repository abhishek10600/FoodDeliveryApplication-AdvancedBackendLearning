import { MenuCategory } from "../../../../domain/entities/menu-cateogry.entity.js";
import { MenuCategoryResult } from "../menu-category-result.dto.js";

export class MenuCategoryResultMapper {
  public static toResult(menuCategory: MenuCategory): MenuCategoryResult {
    return {
      id: menuCategory.getId(),
      menuId: menuCategory.getMenuId(),
      name: menuCategory.getName().getValue(),
      description: menuCategory.getDescription()?.getValue(),
      displayOrder: menuCategory.getDisplayOrder(),
      status: menuCategory.getStatus(),
      createdAt: menuCategory.getCreatedAt(),
      updatedAt: menuCategory.getUpdatedAt()
    }
  }
}
