import { MenuItemImageUpdateInput } from "../../dto/menu-item/menu-item-image-update.dto.js";

export interface MenuItemImageUpdateUseCase {
  execute(input: MenuItemImageUpdateInput): Promise<void>
}
