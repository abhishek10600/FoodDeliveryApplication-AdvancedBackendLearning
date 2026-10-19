import { MenuItemNameUpdateInput } from "../../dto/menu-item/menu-item-name-update.dto.js";

export interface MenuItemNameUpdateUseCase {
  execute(input: MenuItemNameUpdateInput): Promise<void>
}
