import { MenuAddOnGroup } from "../../../../domain/entities/menu-add-on-group.entity.js";
import { MenuAddOnGroupResult } from "../menu-add-on-group-result.dto.js";

export class MenuAddOnGroupResultMapper {

  public static toResult(menuAddOnGroup: MenuAddOnGroup): MenuAddOnGroupResult {
    return {
      id: menuAddOnGroup.getId(),
      menuItemId: menuAddOnGroup.getMenuItemId(),
      name: menuAddOnGroup.getName().getValue(),
      minSelections: menuAddOnGroup.getMinSelections(),
      maxSelections: menuAddOnGroup.getMaxSelections(),
      status: menuAddOnGroup.getStatus(),
      displayOrder: menuAddOnGroup.getDisplayOrder(),
      createdAt: menuAddOnGroup.getCreatedAt(),
      updatedAt: menuAddOnGroup.getUpdatedAt()
    }
  }

}
