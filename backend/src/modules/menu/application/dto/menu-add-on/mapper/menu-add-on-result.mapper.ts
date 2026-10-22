import { MenuAddOn } from "../../../../domain/entities/menu-add-on.entity.js";
import { MenuAddOnResult } from "../menu-add-on-result.dto.js";

export class MenuAddOnResultMapper {
  public static toResult(menuAddOn: MenuAddOn): MenuAddOnResult {
    return {
      id: menuAddOn.getId(),
      menuAddOnGroupId: menuAddOn.getMenuAddOnGroupId(),
      name: menuAddOn.getName().getValue(),
      price: menuAddOn.getPrice(),
      currency: menuAddOn.getCurrency(),
      displayOrder: menuAddOn.getDisplayOrder(),
      status: menuAddOn.getStatus(),
      createdAt: menuAddOn.getCreatedAt(),
      updatedAt: menuAddOn.getUpdatedAt()
    }
  }
}
