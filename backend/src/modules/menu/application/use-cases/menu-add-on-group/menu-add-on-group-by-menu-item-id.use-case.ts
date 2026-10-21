import { MenuAddOnGroupsByMenuItemIdInput } from "../../dto/menu-add-on-group/menu-add-on-group-by-menu-item-id.dto.js";
import { MenuAddOnGroupResult } from "../../dto/menu-add-on-group/menu-add-on-group-result.dto.js";

export interface MenuAddOnGroupByMenuItemIdUseCase {
  execute(input: MenuAddOnGroupsByMenuItemIdInput): Promise<MenuAddOnGroupResult[]>
}
