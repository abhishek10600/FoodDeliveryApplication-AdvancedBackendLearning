import { MenuItemDeletionInput } from "../../dto/menu-item/menu-item-deletion.dto.js";

export interface MenuItemDeletionUseCase {
  execute(input: MenuItemDeletionInput): Promise<void>
}
