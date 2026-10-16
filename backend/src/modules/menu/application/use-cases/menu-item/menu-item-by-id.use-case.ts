import { MenuItemByIdInput } from "../../dto/menu-item/menu-item-by-id.dto.js";
import { MenuItemResult } from "../../dto/menu-item/menu-item-result.dto.js";

export interface MenuItemByIdUseCase {
  execute(input: MenuItemByIdInput): Promise<MenuItemResult>
}
