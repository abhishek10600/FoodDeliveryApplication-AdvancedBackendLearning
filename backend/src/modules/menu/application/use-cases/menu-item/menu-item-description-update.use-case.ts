import { MenuItemDescriptionUpdateInput } from "../../dto/menu-item/menu-item-description-update.dto.js";

export interface MenuItemDescriptionUpdateUseCase {
  execute(input: MenuItemDescriptionUpdateInput): Promise<void>
}
