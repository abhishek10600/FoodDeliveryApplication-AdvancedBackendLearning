import { MenuItemListInput } from "../../dto/menu-item/menu-item-list.dto.js";
import { MenuItemResult } from "../../dto/menu-item/menu-item-result.dto.js";

export interface MenuItemListUseCase {
  execute(input: MenuItemListInput): Promise<MenuItemResult[]>
}
