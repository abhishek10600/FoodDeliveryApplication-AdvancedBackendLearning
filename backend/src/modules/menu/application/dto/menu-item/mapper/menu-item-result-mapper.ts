import { MenuItem } from "../../../../domain/entities/menu-item.entity.js";
import { MenuItemResult } from "../menu-item-result.dto.js";

export class MenuItemResultMapper {
  public static toResult(menuItem: MenuItem): MenuItemResult {
    return {
      id: menuItem.getId(),
      menuCategoryId: menuItem.getMenuCategoryId(),
      name: menuItem.getName().getValue(),
      description: menuItem.getDescription()?.getValue(),
      imageUrl: menuItem.getImageUrl()?.getValue() ?? null,
      price: menuItem.getPrice(),
      currency: menuItem.getCurrency(),
      status: menuItem.getStatus(),
      isAvailable: menuItem.getIsAvailable(),
      displayOrder: menuItem.getDisplayOrder(),
      createdAt: menuItem.getCreatedAt(),
      updatedAt: menuItem.getUpdatedAt()
    }
  }
}
