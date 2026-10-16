import { MenuItemCreationInput } from "../../dto/menu-item/menu-item-creation.dto.js";
import { MenuItemResult } from "../../dto/menu-item/menu-item-result.dto.js";

export interface MenuItemCreationUseCase {
  execute(input: MenuItemCreationInput): Promise<MenuItemResult>
}
