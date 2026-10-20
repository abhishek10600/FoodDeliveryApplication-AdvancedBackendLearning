import { MenuItemAvailabilityUpdateInput } from "../../dto/menu-item/menu-item-availability-update.dto.js";

export interface MenuItemAvailabilityUpdateUseCase {
  execute(input: MenuItemAvailabilityUpdateInput): Promise<void>
}
