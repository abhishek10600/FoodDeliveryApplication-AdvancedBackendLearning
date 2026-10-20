import { MenuItemStatusUpdateInput } from "../../dto/menu-item/menu-item-status-update.dto.js";

export interface MenuItemStatusUpdateUseCase {
  execute(input: MenuItemStatusUpdateInput): Promise<void>
}
